from typing import Dict
from pyspark.sql import DataFrame, SparkSession
from pyspark.sql import functions as F
import pandas as pd
from sklearn.metrics import classification_report
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split


# def get_course_overview(
#     spark: SparkSession,
#     attendance_df: DataFrame,
#     lms_df: DataFrame,
#     demographic_df: DataFrame,
#     course_id: str,
# ):
#     # ✅ Attendance summary
#     attendance_summary = (
#         attendance_df.filter(F.col("course_id") == course_id)
#         .groupBy("attendance_status")
#         .count()
#         .toPandas()
#     )

#     # ✅ LMS Engagement Summary (based on engagement_score, quizzes, assignments)
#     lms_engagement = lms_df.agg(
#         F.avg("lms_engagement_score").alias("avg_engagement_score"),
#         F.avg("quizzes_completed").alias("avg_quizzes_completed"),
#         F.avg("assignments_completed").alias("avg_assignments_completed"),
#     ).toPandas()

#     # ✅ Create temp views for SQL
#     attendance_df.createOrReplaceTempView("attendance_data")
#     lms_df.createOrReplaceTempView("lms_data")
#     demographic_df.createOrReplaceTempView("student_demographic_data")

#     # ✅ Student performance query
#     student_performance_query = f"""
#         WITH student_course_performance AS (
#             SELECT 
#                 d.student_id,
#                 d.gpa AS current_gpa,
#                 a.attendance_percentage,
#                 l.quizzes_completed
#             FROM student_demographic_data d
#             JOIN attendance_data a ON d.student_id = a.student_id
#             JOIN lms_data l ON d.student_id = l.student_id AND a.course_id = l.course_id
#             WHERE a.course_id = '{course_id}'
#         )
#         SELECT 
#             student_id,
#             current_gpa,
#             attendance_percentage,
#             ROUND(AVG(quizzes_completed), 2) as avg_quizzes,
#             COUNT(*) as total_records
#         FROM student_course_performance
#         GROUP BY student_id, current_gpa, attendance_percentage
#         HAVING total_records > 0
#     """

#     student_performance = spark.sql(student_performance_query).toPandas()

#     # ✅ Summary metrics
#     summary_metrics = {
#         "total_students": len(student_performance),
#         "avg_gpa": (
#             round(student_performance["current_gpa"].mean(), 2)
#             if not student_performance.empty
#             else 0
#         ),
#         "avg_attendance": (
#             round(student_performance["attendance_percentage"].mean(), 2)
#             if not student_performance.empty
#             else 0
#         ),
#         "avg_quizzes": (
#             round(student_performance["avg_quizzes"].mean(), 2)
#             if not student_performance.empty
#             else 0
#         ),
#     }

#     return {
#         "summary_metrics": summary_metrics,
#         "attendance_summary": attendance_summary.to_dict(orient="records"),
#         "lms_engagement": lms_engagement.to_dict(orient="records"),
#         "student_performance": student_performance.to_dict(orient="records"),
#     }



def get_course_overview(
    spark: SparkSession,
    attendance_df: DataFrame,
    lms_df: DataFrame,
    demographic_df: DataFrame,
    # course_id: str,  # remove this parameter
):
    # Attendance summary without filtering course_id
    attendance_summary = (
        attendance_df
        .groupBy("attendance_status")
        .count()
        .toPandas()
    )

    # LMS Engagement Summary without filtering course_id
    lms_engagement = lms_df.agg(
        F.avg("lms_engagement_score").alias("avg_engagement_score"),
        F.avg("quizzes_completed").alias("avg_quizzes_completed"),
        F.avg("assignments_completed").alias("avg_assignments_completed"),
    ).toPandas()

    # Create temp views
    attendance_df.createOrReplaceTempView("attendance_data")
    lms_df.createOrReplaceTempView("lms_data")
    demographic_df.createOrReplaceTempView("student_demographic_data")

    # Student performance query without course_id filter
    student_performance_query = """
        WITH student_course_performance AS (
            SELECT 
                d.student_id,
                d.gpa AS current_gpa,
                a.attendance_percentage,
                l.quizzes_completed
            FROM student_demographic_data d
            JOIN attendance_data a ON d.student_id = a.student_id
            JOIN lms_data l ON d.student_id = l.student_id AND a.course_id = l.course_id
        )
        SELECT 
            student_id,
            current_gpa,
            attendance_percentage,
            ROUND(AVG(quizzes_completed), 2) as avg_quizzes,
            COUNT(*) as total_records
        FROM student_course_performance
        GROUP BY student_id, current_gpa, attendance_percentage
        HAVING total_records > 0
    """

    student_performance = spark.sql(student_performance_query).toPandas()

    summary_metrics = {
        "total_students": len(student_performance),
        "avg_gpa": round(student_performance["current_gpa"].mean(), 2) if not student_performance.empty else 0,
        "avg_attendance": round(student_performance["attendance_percentage"].mean(), 2) if not student_performance.empty else 0,
        "avg_quizzes": round(student_performance["avg_quizzes"].mean(), 2) if not student_performance.empty else 0,
         "avg_assignments": round(lms_engagement["avg_assignments_completed"].iloc[0], 2) if not lms_engagement.empty else 0
    }

    return {
        "summary_metrics": summary_metrics,
        "attendance_summary": attendance_summary.to_dict(orient="records"),
        "lms_engagement": lms_engagement.to_dict(orient="records"),
        "student_performance": student_performance.to_dict(orient="records"),
    }




def predict_course_demand_from_df(spark_df: pd.DataFrame):
    df = spark_df.toPandas()
    # Feature columns
    feature_cols = [
        "gpa",
        "attendance_rate",
        "hours_studied_per_week",
        "previous_failures",
        "quizzes_completed",
        "assignments_completed",
        "lms_engagement_score",
        "preferred_course",  # categorical
        "course_id",  # categorical
    ]

    # Drop columns if they exist (axis=1 means columns)
    cols_to_drop = ["Name", "student_id", "date", "predicted_timestamp"]
    existing_cols_to_drop = [col for col in cols_to_drop if col in df.columns]
    df = df.drop(existing_cols_to_drop, axis=1)

    # Encode categorical features
    label_encoders = {}
    for col in feature_cols:
        if col in df.columns and df[col].dtype == "object":
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col].astype(str))
            label_encoders[col] = le

    # Encode target variable
    target_le = LabelEncoder()
    df["course_demand"] = target_le.fit_transform(df["course_demand"].astype(str))

    # Select features and target
    X = df[feature_cols]
    y = df["course_demand"]

    # Train/Test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Train model
    model = RandomForestClassifier(
        n_estimators=200, max_depth=10, class_weight="balanced", random_state=42
    )
    model.fit(X_train, y_train)

    # Predict
    y_pred = model.predict(X_test)

    # Evaluation
    print("📊 Classification Report:\n")
    print(classification_report(y_test, y_pred, target_names=target_le.classes_))

    # Prepare output
    output = X_test.copy()
    output["actual_course_demand"] = target_le.inverse_transform(y_test)
    output["predicted_course_demand"] = target_le.inverse_transform(y_pred)

    # Inverse transform categorical features back to original strings
    for col in ["preferred_course", "course_id"]:
        if col in output.columns and col in label_encoders:
            output[col] = label_encoders[col].inverse_transform(output[col])

    return output.reset_index(drop=True).to_dict(orient="records")
