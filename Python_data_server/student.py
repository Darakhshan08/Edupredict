from pyspark.sql.functions import col, avg, count, when,to_date , count
from pyspark.sql import DataFrame
from sklearn.linear_model import LinearRegression
from typing import Dict, Optional
import pandas as pd

def get_student_dashboard_data(attendance_df: DataFrame,lms_df:DataFrame,demographic_df:DataFrame,student_id):
        attendance_stats = attendance_df \
            .filter(col("student_id") == student_id) \
            .groupBy("student_id") \
            .agg(
                avg(col("attendance_percentage").cast("float")).alias("avg_attendance"),  # Fixed reference
                count(when(col("attendance_status") == "Present", 1)).alias("total_present"),
                count(when(col("attendance_status") == "Late", 1)).alias("total_late"),
                count(when(col("attendance_status") == "Absent", 1)).alias("total_absent")
            )

        # LMS Activity Analysis
        lms_stats = lms_df \
            .filter(col("student_id") == student_id) \
            .groupBy("student_id") \
            .agg(
                count(when(col("action_type") == "quiz_complete", 1)).alias("quizzes_completed"),
                count(when(col("action_type") == "discussion_post", 1)).alias("discussion_posts"),
                count(when(col("action_type") == "page_view", 1)).alias("pages_viewed"),
                avg("session_duration").alias("avg_session_duration")
            )

        # Demographic and Academic Data
        student_info = demographic_df \
            .filter(col("student_id") == student_id) \
            .select("*")

        # Combine all data
        combined_data = attendance_stats \
            .join(lms_stats, "student_id", "outer") \
            .join(student_info, "student_id", "outer")

        # Convert to Pandas DataFrame and return as dictionary
        return combined_data.toPandas().to_dict(orient='records')[0]
    
def perform_attendance_trend_analysis_student(
    attendance_data: pd.DataFrame,
    student_id: str,
    limit: Optional[str] = None
) -> Dict[str, list]:
    
    attendance_data = attendance_data[attendance_data["student_id"] == student_id]

    # Ensure date is in datetime format
    attendance_data["date"] = pd.to_datetime(attendance_data["date"])
    
    # Group by dates and compute average attendance percentages for each date
    grouped_data = attendance_data.groupby("date").agg({
        "attendance_percentage": "mean"  # Compute the average attendance percentage per date
    }).reset_index()
    
    # Apply limit if provided
    if limit:
        grouped_data = grouped_data.head(int(limit))
    
    # Convert dates to numeric format for regression
    grouped_data["date_numeric"] = grouped_data["date"].apply(lambda x: x.toordinal())
    
    # Prepare variables for regression
    X = grouped_data[["date_numeric"]].values
    Y = grouped_data["attendance_percentage"].values
    
    # Fit linear regression model
    model = LinearRegression()
    model.fit(X, Y)
    
    # Generate predictions
    predictions = model.predict(X)
    
    return {
        "labels": grouped_data["date"].dt.strftime("%Y-%m-%d").tolist(),
        "actual": grouped_data["attendance_percentage"].tolist(),
        "predicted": predictions.tolist(),
        "trend_slope": float(model.coef_[0]),
        "trend_intercept": float(model.intercept_)
    }

def get_course_avg(lms_df:DataFrame,student_id):
            lms_stats = lms_df \
            .filter(col("student_id") == student_id)
            
            avg_session_duration_df = (
           lms_stats.groupBy("course_id")
           .agg({"session_duration": "avg"})
           .withColumnRenamed("avg(session_duration)", "avg_session_duration"))
            
            result = avg_session_duration_df.collect()
    
    # Format the result into a list of dictionaries
            formatted_result = [{"course_id": row["course_id"], "avg_session_duration": row["avg_session_duration"]} for row in result]
    
            return formatted_result
    

    
def get_quiz_summary_by_course(df: DataFrame):
    # Group by course_id and sum quizzes_completed
    summary_df = (
        df.groupBy("course_id")
          .agg(count("quizzes_completed").alias("quizzes_completed"))
    )

    return [
        {"course_id": row["course_id"], "quizzes_completed": int(row["quizzes_completed"] or 0)}
        for row in summary_df.collect()
]

def get_assignment_by_course(df: DataFrame):
    # Group by course_id and sum quizzes_completed
    summary_df = (
        df.groupBy("preferred_course")
          .agg(count("assignments_completed").alias("assignments_completed"))
    )

    return [
        {"preferred_course": row["preferred_course"], "assignments_completed": int(row["assignments_completed"] or 0)}
        for row in summary_df.collect()
]