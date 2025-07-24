import pandas as pd
import numpy as np
from pyspark.sql import DataFrame
from pyspark.sql.functions import col, avg, count, date_format, sum as _sum, to_date, lag, datediff, when, lit, first
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from typing import  Dict, List, Optional
from datetime import datetime
from sklearn.metrics import classification_report, accuracy_score
from sklearn.model_selection import train_test_split

def filter_date_range(df: DataFrame, start_date: Optional[str] = None, end_date: Optional[str] = None) -> DataFrame:
    filtered_df = df
    if start_date:
        filtered_df = filtered_df.filter(col("date") >= start_date)
    if end_date:
        filtered_df = filtered_df.filter(col("date") <= end_date)
    return filtered_df

def get_all_attendance(spark_df: DataFrame):
    return [row.asDict() for row in spark_df.collect()]

def get_attendance_by_course(spark_df: DataFrame, course_id: str):
    filtered_df = spark_df.filter(col("course_id") == course_id)
    return [row.asDict() for row in filtered_df.collect()]

def get_attendance_by_student(spark_df: DataFrame, student_id: str, course_id: str, limits: str):
    filtered_df = spark_df.filter((col("student_id") == student_id) & (col("course_id") == course_id))
    sorted_df = filtered_df.orderBy(col("date").desc()).limit(int(limits))
    return [row.asDict() for row in sorted_df.collect()]

def get_attendance_analytics(spark_df: DataFrame):
    analytics_df = spark_df.groupBy("course_id").agg(avg("attendance_percentage").alias("average_attendance"))
    return [row.asDict() for row in analytics_df.collect()]

def perform_random_forest_regression(attendance_data: pd.DataFrame):
    attendance_data["date"] = pd.to_datetime(attendance_data["date"])
    attendance_data["date_numeric"] = attendance_data["date"].apply(lambda x: x.toordinal())

    X = attendance_data[["date_numeric"]].values
    Y = attendance_data["attendance_percentage"].values

    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, Y)

    predictions = model.predict(X)
    labels = attendance_data["date"].dt.strftime("%Y-%m-%d").tolist()
    data = predictions.tolist()

    return labels, data

##This function is used for Student detail to fetch student record (Pie Chart)

def calculate_attendance_statistics(spark_df: DataFrame) -> Dict[str, Dict]:
    overall_stats = spark_df.agg(
        avg("attendance_percentage").alias("avg_attendance"),
        (count(when(col("attendance_status") == "Present", 1)) * 100 / count("*")).alias("overall_presence_rate"),
        (count(when(col("attendance_status") == "Late", 1)) * 100 / count("*")).alias("overall_late_rate"),
        (count(when(col("attendance_status") == "Absent", 1)) * 100 / count("*")).alias("overall_absence_rate")
    ).toPandas().to_dict('records')[0]

    course_stats = spark_df.groupBy("course_id").agg(
        avg("attendance_percentage").alias("avg_attendance"),
        count("*").alias("total_sessions")
    ).toPandas().to_dict('records')

    student_stats = spark_df.groupBy("student_id").agg(
    first("name").alias("name"),
    avg("attendance_percentage").alias("avg_attendance"),
    _sum(when(col("attendance_status") == "Present", 1).otherwise(0)).alias("present_count"),
    _sum(when(col("attendance_status") == "Late", 1).otherwise(0)).alias("late_count"),
    _sum(when(col("attendance_status") == "Absent", 1).otherwise(0)).alias("absent_count")
)
# ✅ Remove rows where all counts are 0
    filtered_stats_df = student_stats.filter(
    (col("present_count") > 0) | (col("late_count") > 0) | (col("absent_count") > 0)
)
    # ✅ Convert to Pandas + dict
    student_stats = filtered_stats_df.toPandas().to_dict("records")

    return {
        "overall": {k: round(float(v), 2) if isinstance(v, (float, np.float64)) else v for k, v in overall_stats.items()},
        "course_wise": course_stats,
        "student_wise": student_stats
    }

## Student table work
def calculate_course_performance_metrics(spark_df: DataFrame) -> Dict[str, List]:
    """
    Calculates various performance metrics for each course.
    Returns data formatted for bar/radar charts, including both percentages and counts.
    """
    metrics = (
        spark_df.groupBy("preferred_course")
        .agg(
            avg("attendance_percentage").alias("avg_attendance"),
            count("*").alias("total_students"),
            count(when(col("attendance_status") == "Present", 1)).alias("present_count"),
            count(when(col("attendance_status") == "Late", 1)).alias("late_count"),
            count(when(col("attendance_status") == "Absent", 1)).alias("absent_count"),
            (
                count(when(col("attendance_status") == "Present", 1)) * 100 / count("*")
            ).alias("presence_rate"),
            (
                count(when(col("attendance_status") == "Late", 1)) * 100 / count("*")
            ).alias("late_rate"),
            (
                count(when(col("attendance_status") == "Absent", 1)) * 100 / count("*")
            ).alias("absence_rate"),
        )
        .toPandas()
    )

    return {
        "course_ids": metrics["preferred_course"].tolist(),
        "metrics": {
            "average_attendance": metrics["avg_attendance"].round(2).tolist(),
            "total_students": metrics["total_students"].tolist(),
            "present_count": metrics["present_count"].tolist(),
            "late_count": metrics["late_count"].tolist(),
            "absent_count": metrics["absent_count"].tolist(),
            "presence_rate": metrics["presence_rate"].round(2).tolist(),
            "late_rate": metrics["late_rate"].round(2).tolist(),
            "absence_rate": metrics["absence_rate"].round(2).tolist(),
            "total_courses": len(set(metrics["preferred_course"].tolist()))  # ✅ unique preferred_course count
},

}

def generate_attendance_heatmap_data(spark_df: DataFrame) -> Dict[str, List]:
    heatmap_data = spark_df.select(
        date_format("date", "E").alias("day_of_week"),
        col("course_id"),
        col("attendance_status")
    ).groupBy("day_of_week", "course_id").agg(
        (count(col("attendance_status").like("Present")) * 100 / count("*")).alias("attendance_rate")
    ).toPandas()

    pivot_data = heatmap_data.pivot(
        index="day_of_week",
        columns="course_id",
        values="attendance_rate"
    ).round(2)

    return {
        "days": pivot_data.index.tolist(),
        "courses": pivot_data.columns.tolist(),
        "values": pivot_data.values.tolist()
    }


## Overview
def perform_attendance_trend_analysis(attendance_data: pd.DataFrame, limit: Optional[str] = None) -> Dict[str, List]:
    attendance_data["date"] = pd.to_datetime(attendance_data["date"])
    grouped_data = attendance_data.groupby("date").agg({"attendance_percentage": "mean"}).reset_index()

    if limit:
        grouped_data = grouped_data.head(int(limit))

    grouped_data["date_numeric"] = grouped_data["date"].apply(lambda x: x.toordinal())
    X = grouped_data[["date_numeric"]].values
    Y = grouped_data["attendance_percentage"].values

    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, Y)
    predictions = model.predict(X)

    return {
        "labels": grouped_data["date"].dt.strftime("%Y-%m-%d").tolist(),
        "actual": grouped_data["attendance_percentage"].tolist(),
        "predicted": predictions.tolist(),
        "trend_slope": None,
        "trend_intercept": None
}


# Attendence table admin

#http://localhost:3001/attendance_status
def generate_attendance_table(attendance_data: pd.DataFrame) -> List[Dict]:
    required_cols = {"student_id", "Name", "preferred_course", "attendance_status", "timestamp"}
    missing = required_cols - set(attendance_data.columns)
    if missing:
        raise ValueError(f"Missing columns in data: {missing}")

    formatted = []
    for idx, row in attendance_data.iterrows():
        raw_timestamp = row["timestamp"]
        formatted_time = (
            pd.to_datetime(raw_timestamp).strftime("%I:%M %p")
            if pd.notnull(raw_timestamp) else "N/A"
        )

        formatted.append({
            "id": f"rec-{idx}",  # unique id
            "student_id": row["student_id"],
            "student_name": row["Name"],
            "course": row["preferred_course"],
            "status": row["attendance_status"],
            "time": formatted_time
        })

    return formatted

# Student Count
def train_rf_model_and_get_dropout_summary(spark_df: DataFrame):
    # ✅ Step 1: Define feature columns based on your dataset
    feature_cols = [
        "attendance_rate",
        "gpa",
        "hours_studied_per_week",
        "previous_failures",
        "attendance_percentage",
        "quizzes_completed",
        "assignments_completed",
        "lms_engagement_score"
    ]

    # ✅ Step 2: Convert Spark DataFrame to Pandas and select required columns
    pandas_df = spark_df.select("student_id", *feature_cols, "dropout_risk").toPandas()

    # ✅ Step 3: Drop missing values
    pandas_df.dropna(subset=["student_id"] + feature_cols + ["dropout_risk"], inplace=True)

    # ✅ Step 4: Encode categorical target into numbers
    risk_map = {"Low": 0, "Medium": 1, "High": 2}
    inverse_risk_map = {v: k for k, v in risk_map.items()}  # To convert back later
    pandas_df["dropout_risk_encoded"] = pandas_df["dropout_risk"].map(risk_map)

    # ✅ Step 5: Split data into train/test sets
    X = pandas_df[feature_cols]
    y = pandas_df["dropout_risk_encoded"]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # ✅ Step 6: Train classifier
    rf_model = RandomForestClassifier(random_state=42)
    rf_model.fit(X_train, y_train)

    # ✅ Step 7: Predict on test set
    y_pred = rf_model.predict(X_test)

    # ✅ Step 8: Map predictions back to "Low", "Medium", "High"
    risk_labels = [inverse_risk_map[pred] for pred in y_pred]

    # ✅ Step 9: Get corresponding student IDs from test set
    student_ids_test = pandas_df.loc[X_test.index, "student_id"]

    # ✅ Step 10: Create summary DataFrame
    result_df = pd.DataFrame({
        "student_id": student_ids_test.values,
        "predicted_dropout_risk": risk_labels
    })
    print(pandas_df['dropout_risk'].value_counts())

    summary_df = (
        result_df.groupby("predicted_dropout_risk")["student_id"]
        .nunique()
        .reset_index()
        .rename(columns={"student_id": "student_count"})
        .sort_values("predicted_dropout_risk")
    )

    # ✅ Step 11: Return result as list of dicts
    return summary_df.to_dict(orient="records")


#////////////////////////

# per_student dropout
def calculate_dropout_risk_per_student(spark_df: DataFrame):
    feature_cols = [
        "attendance_rate",
        "gpa",
        "hours_studied_per_week",
        "previous_failures",
        "attendance_percentage",
        "quizzes_completed",
        "assignments_completed",
        "lms_engagement_score"
    ]

    # Step 1: Convert Spark DataFrame to Pandas
    pandas_df = spark_df.select(
        "student_id", "Name", "preferred_course", *feature_cols
    ).toPandas()
    pandas_df.dropna(subset=["student_id", "Name"] + feature_cols, inplace=True)
    pandas_df = pandas_df.reset_index(drop=True)

    # Step 2: Normalize features (0-1 scale)
    norm_df = pandas_df.copy()
    for col in feature_cols:
        if col == "previous_failures":
            # Lower failures = better, so reverse normalize
            norm_df[col] = 1 - (norm_df[col] - norm_df[col].min()) / (norm_df[col].max() - norm_df[col].min())
        else:
            norm_df[col] = (norm_df[col] - norm_df[col].min()) / (norm_df[col].max() - norm_df[col].min())

    # Step 3: Calculate average score
    norm_df['average_score'] = norm_df[feature_cols].mean(axis=1)

    # Step 4: Assign dropout risk (Dynamic with Medium value too)
    student_risks = []
    for idx, row in norm_df.iterrows():
        avg = row['average_score']
        attendance = row['attendance_percentage']

        # 💡 Better logic for dynamic dropout percentages
        if avg >= 0.75:
            # Strong student
            risk = {
                "Low": round(avg * 100, 2),
                "Medium": round((1 - avg) * 50, 2),
                "High": round((1 - avg) * 50, 2)
            }
        elif avg >= 0.45:
            # Borderline student
            risk = {
                "Low": round(avg * 60, 2),
                "Medium": round((1 - abs(0.5 - avg)) * 100 * 0.6, 2),
                "High": round((1 - avg) * 40, 2)
            }
        else:
            # Weak student
            risk = {
                "Low": round(avg * 40, 2),
                "Medium": round(avg * 20, 2),
                "High": round((1 - avg) * 100, 2)
            }

        # Adjust rounding errors so total = 100%
        total = sum(risk.values())
        if total != 100.0:
            diff = round(100.0 - total, 2)
            if "Medium" in risk:
                risk["Medium"] = round(risk["Medium"] + diff, 2)
            else:
                risk["Low"] = round(risk["Low"] + diff, 2)

        # Max risk category
        risk_level = max(risk, key=risk.get)

        student_data = {
            "student_id": pandas_df.loc[idx, "student_id"],
            "name": pandas_df.loc[idx, "Name"],
            "Course": pandas_df.loc[idx, "preferred_course"],
            "average_score": round(avg * 100, 2),
            "attendance": round(attendance * 100, 2),
            "estimated_dropout_risk_percentage": risk,
            "risk_level": risk_level
        }
        student_risks.append(student_data)

    # Return sorted by student_id
    return sorted(student_risks, key=lambda x: x["student_id"])




# per student Performance 
def train_rf_model_and_get_student_probabilities(spark_df):
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.model_selection import train_test_split
    import pandas as pd

    feature_cols = [
        "attendance_rate",
        "gpa",
        "hours_studied_per_week",
        "previous_failures",
        "attendance_percentage",
        "quizzes_completed",
        "assignments_completed",
        "lms_engagement_score"
    ]

    # "Name" column bhi select karen
    pandas_df = spark_df.select("student_id", "Name", *feature_cols, "predicted_performance").toPandas()

    pandas_df["predicted_performance"] = pandas_df["predicted_performance"].replace({
        "Low": "Below Average",
        "Medium": "Average",
        "High": "Excellent"
    })

    pandas_df.dropna(subset=["student_id", "Name"] + feature_cols + ["predicted_performance"], inplace=True)

    performance_map = {
        "Below Average": 0,
        "Average": 1,
        "Above Average": 2,
        "Excellent": 3
    }
    class_names = ["Below Average", "Average", "Above Average", "Excellent"]
    pandas_df["performance_encoded"] = pandas_df["predicted_performance"].map(performance_map)

    X = pandas_df[feature_cols]
    y = pandas_df["performance_encoded"]

    # Train-test split with index tracking
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    test_indices = y_test.index  # These are the indices in the original pandas_df

    model = RandomForestClassifier(n_estimators=100, class_weight='balanced', random_state=42)
    model.fit(X_train, y_train)

    y_proba = model.predict_proba(X_test)

    top_indices = y_proba.argmax(axis=1)
    top_percentages = y_proba.max(axis=1) * 100
    top_classes = [class_names[i] for i in top_indices]

    # Prepare the result DataFrame for test set only, with Name
    result_df = pd.DataFrame({
        "Student ID": pandas_df.loc[test_indices, "student_id"].values,
        "Name": pandas_df.loc[test_indices, "Name"].values,
        "Predicted_performance": top_classes,
        "Percentage": top_percentages.round(0).astype(int)
    })

    return result_df.to_dict(orient="records")



#predict performance and get performance summary total student count
def train_rf_model_and_get_performance_summary(spark_df: DataFrame):
    # Step 1: Feature columns
    feature_cols = [
        "attendance_rate",
        "gpa",
        "hours_studied_per_week",
        "previous_failures",
        "attendance_percentage",
        "quizzes_completed",
        "assignments_completed",
        "lms_engagement_score"
    ]

    # Step 2: Convert Spark to Pandas
    pandas_df = spark_df.select("student_id", *feature_cols, "predicted_performance").toPandas()

    # Step 3: Map old labels
    pandas_df["predicted_performance"] = pandas_df["predicted_performance"].replace({
        "Low": "Below Average",
        "Medium": "Average",
        "High": "Excellent"
    })

    # Step 4: Drop rows with missing values
    pandas_df.dropna(subset=["student_id"] + feature_cols + ["predicted_performance"], inplace=True)

    # Step 5: Encode labels
    performance_map = {
        "Below Average": 0,
        "Average": 1,
        "Above Average": 2,
        "Excellent": 3
    }
    inverse_perf_map = {v: k for k, v in performance_map.items()}
    pandas_df["performance_encoded"] = pandas_df["predicted_performance"].map(performance_map)

    # Step 6: Prepare X and y
    X = pandas_df[feature_cols]
    y = pandas_df["performance_encoded"]

    # Step 7: Train model on full dataset
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)

    # Step 8: Predict on full dataset
    y_pred = model.predict(X)
    predicted_labels = [inverse_perf_map[val] for val in y_pred]
    pandas_df["predicted_performance_label"] = predicted_labels

    # Step 9: Group and count predicted labels
    summary_df = (
        pandas_df.groupby("predicted_performance_label")["student_id"]
        .count()
        .reset_index()
        .rename(columns={"student_id": "student_count", "predicted_performance_label": "predicted_performance"})
        .sort_values("predicted_performance")
    )

    # Step 10: Add percentage column
    total_students = summary_df["student_count"].sum()
    summary_df["percentage"] = (summary_df["student_count"] / total_students * 100).round(2)

    return summary_df.to_dict(orient="records")


# student Performance
# def train_rf_model_and_get_student_probabilities(spark_df):
#     from sklearn.ensemble import RandomForestClassifier
#     import pandas as pd

#     # Step 1: Feature columns
#     feature_cols = [
#         "attendance_rate",
#         "gpa",
#         "hours_studied_per_week",
#         "previous_failures",
#         "attendance_percentage",
#         "quizzes_completed",
#         "assignments_completed",
#         "lms_engagement_score"
#     ]

#     pandas_df = spark_df.select("student_id", *feature_cols, "predicted_performance").toPandas()

#     pandas_df["predicted_performance"] = pandas_df["predicted_performance"].replace({
#         "Low": "Below Average",
#         "Medium": "Average",
#         "High": "Excellent"
#     })

#     pandas_df.dropna(subset=["student_id"] + feature_cols + ["predicted_performance"], inplace=True)

#     performance_map = {
#         "Below Average": 0,
#         "Average": 1,
#         "Above Average": 2,
#         "Excellent": 3
#     }
#     inverse_perf_map = {v: k for k, v in performance_map.items()}
#     pandas_df["performance_encoded"] = pandas_df["predicted_performance"].map(performance_map)

#     X = pandas_df[feature_cols]
#     y = pandas_df["performance_encoded"]

#     model = RandomForestClassifier(n_estimators=100, class_weight='balanced', random_state=42)
#     model.fit(X, y)

#     y_proba = model.predict_proba(X)

#     # Get class names in the same order as columns
#     class_names = ["Below Average", "Average", "Above Average", "Excellent"]

#     # Find the index of the max probability for each student
#     top_indices = y_proba.argmax(axis=1)
#     top_percentages = y_proba.max(axis=1) * 100
#     top_classes = [class_names[i] for i in top_indices]

#     # Prepare the result DataFrame
#     result_df = pd.DataFrame({
#         "Student ID": pandas_df["student_id"].values,
#         "Predicted_performace": top_classes,
#         "Percentage": top_percentages.round(0).astype(int)
#     })

#     return result_df.to_dict(orient="records")




#--------------------------

# def train_rf_model_and_get_student_probabilities(spark_df):
#     from sklearn.ensemble import RandomForestClassifier
#     import pandas as pd

#     # Step 1: Feature columns
#     feature_cols = [
#         "attendance_rate",
#         "gpa",
#         "hours_studied_per_week",
#         "previous_failures",
#         "attendance_percentage",
#         "quizzes_completed",
#         "assignments_completed",
#         "lms_engagement_score"
#     ]

#     pandas_df = spark_df.select("student_id", *feature_cols, "predicted_performance").toPandas()

#     pandas_df["predicted_performance"] = pandas_df["predicted_performance"].replace({
#         "Low": "Below Average",
#         "Medium": "Average",
#         "High": "Excellent"
#     })

#     pandas_df.dropna(subset=["student_id"] + feature_cols + ["predicted_performance"], inplace=True)

#     performance_map = {
#         "Below Average": 0,
#         "Average": 1,
#         "Above Average": 2,
#         "Excellent": 3
#     }
#     inverse_perf_map = {v: k for k, v in performance_map.items()}
#     pandas_df["performance_encoded"] = pandas_df["predicted_performance"].map(performance_map)

#     X = pandas_df[feature_cols]
#     y = pandas_df["performance_encoded"]

#     model = RandomForestClassifier(n_estimators=100, class_weight='balanced', random_state=42)
#     model.fit(X, y)

#     y_proba = model.predict_proba(X)

#     # Get class names in the same order as columns
#     class_names = ["Below Average", "Average", "Above Average", "Excellent"]

#     # Find the index of the max probability for each student
#     top_indices = y_proba.argmax(axis=1)
#     top_percentages = y_proba.max(axis=1) * 100
#     top_classes = [class_names[i] for i in top_indices]

#     # Prepare the result DataFrame
#     result_df = pd.DataFrame({
#         "Student ID": pandas_df["student_id"].values,
#         "Predicted_performace": top_classes,
#         "Percentage": top_percentages.round(0).astype(int)
#     })

#     return result_df.to_dict(orient="records")


