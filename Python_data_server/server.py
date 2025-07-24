import sys
from typing import Any, Dict, List
import uvicorn
from fastapi import FastAPI, HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pyspark.sql import SparkSession, DataFrame
import pandas as pd
from contextlib import asynccontextmanager
from studentInput import StudentInput, predict_student_from_input  # ✅ This imports only the class
# from studentInput import last_metrics , rf_model
# from model_state import rf_model, last_metrics
from model_state import ModelState
from studentInput import StudentInput, predict_student_from_input, train_model_from_csv



# Custom analysis functions
from lms import (
    get_action_type_distribution,
    get_course_engagement_metrics,
    get_student_performance
)
from attendance import (
    calculate_dropout_risk_per_student,
    generate_attendance_table,
    get_all_attendance,
    get_attendance_by_course,
    get_attendance_by_student,
    get_attendance_analytics,
    perform_random_forest_regression,  # ✅ This uses RandomForest inside
    calculate_attendance_statistics,
    calculate_course_performance_metrics,
    generate_attendance_heatmap_data,
    perform_attendance_trend_analysis,
    # predict_student_performance,
    train_rf_model_and_get_dropout_summary,
    train_rf_model_and_get_performance_summary,
    train_rf_model_and_get_student_probabilities,
    # train_rf_model_and_get_performance_summary,
    # train_rf_model_and_get_student_predictions,
    # train_rf_model_and_get_full_probabilities,
    # train_rf_model_and_get_student_predictions,
    # train_rf_model_and_get_student_predictions,
   

   
)

from demographics import (
    get_demographic_summary,
    get_educational_insights,
    get_risk_analysis,
    get_overall_student_statistics
)
from student import(
    get_assignment_by_course,
    get_quiz_summary_by_course,
    get_student_dashboard_data,
    perform_attendance_trend_analysis_student,
    get_course_avg
)
import studentInput
from teacher import (
    get_course_overview,
    predict_course_demand_from_df
)

# Global Spark session and dataset references
spark: SparkSession = None
df: DataFrame = None
pandas_data: pd.DataFrame = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global spark, df, pandas_data
    try:
        print("Starting up Spark session...")
        spark = SparkSession.builder.appName("EduPredict Unified Server").getOrCreate()

        print("Loading unified dataset...")
        dataset_path = "datasets/edupredict_4000_shuffled.csv"
        df = spark.read.csv(dataset_path, header=True, inferSchema=True)
        pandas_data = df.toPandas()

        print("Dataset loaded successfully.")

        # ✅ Train model here
        # from studentInput import train_model_from_csv
        train_model_from_csv(df)  # This line is important!

        yield
    finally:
        if spark:
            print("Shutting down Spark session...")
            spark.stop()
            print("Spark session stopped.")

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_spark_session():
    return spark

def get_spark_df():
    if df is None:
        raise HTTPException(status_code=503, detail="Dataset not initialized.")
    return df

def get_pandas_data():
    if pandas_data is None:
        raise HTTPException(status_code=503, detail="Dataset not initialized.")
    return pandas_data

@app.get("/")
def root():
    return {"message": "EduPredict Unified API is running"}

# All attendance endpoints remain unchanged...
@app.get("/attendance")
def fetch_all_attendance(spark_df: DataFrame = Depends(get_spark_df)):
    try:
        return JSONResponse(content=get_all_attendance(spark_df))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/attendance/course/{course_id}")
def fetch_attendance_by_course(course_id: str, spark_df: DataFrame = Depends(get_spark_df)):
    try:
        return JSONResponse(content=get_attendance_by_course(spark_df, course_id))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/attendance/student/{student_id}/{course_id}/{limits}")
def fetch_attendance_by_student(student_id: str, course_id: str, limits: str, spark_df: DataFrame = Depends(get_spark_df)):
    try:
        return JSONResponse(content=get_attendance_by_student(spark_df, student_id, course_id, limits))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analytics")
def fetch_analytics(spark_df: DataFrame = Depends(get_spark_df)):
    try:
        return JSONResponse(content=get_attendance_analytics(spark_df))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
@app.get("/attendance_status")
def fetch_attendance_table(spark_df: DataFrame = Depends(get_spark_df)):
    try:
        pandas_df = spark_df.toPandas()

        # Keep only the first occurrence per student_id (ensure uniqueness)
        unique_df = pandas_df.drop_duplicates(subset="student_id")

        # Limit to first 30 unique records
        limited_df = unique_df.head(50)

        table_data = generate_attendance_table(limited_df)
        return JSONResponse(content=table_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

  

@app.get("/attendance_statistics")
def fetch_attendance_statistics(spark_df: DataFrame = Depends(get_spark_df)):
    
    try:
        analytics = calculate_attendance_statistics(spark_df)
        return JSONResponse(content=analytics)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/course_demand")
def course_demand(spark_df: DataFrame = Depends(get_spark_df)):
    
    try:
        analytics = predict_course_demand_from_df(spark_df)
        return JSONResponse(content=analytics)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/attendance_course_performance")
def fetch_course_performance(spark_df: DataFrame = Depends(get_spark_df)):
    try:
        analytics = calculate_course_performance_metrics(spark_df)
        return JSONResponse(content=analytics)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/attendance_heatmap")
def fetch_heatmap(spark_df: DataFrame = Depends(get_spark_df)):
    try:
        return JSONResponse(content=generate_attendance_heatmap_data(spark_df))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/dropout_risk_by_course")
def risk_analysis(spark_df: DataFrame = Depends(get_spark_df)):
    try:
        return JSONResponse(content=train_rf_model_and_get_dropout_summary(spark_df))
    except Exception as e:
       raise HTTPException(status_code=500, detail=str(e))  
    
@app.get("/dropout_risk_percentage")
def risk_analysis(spark_df: DataFrame = Depends(get_spark_df)):
    try:
        return JSONResponse(content=calculate_dropout_risk_per_student(spark_df))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    
    
@app.get("/get_student_probabilities")
def risk_analysis(spark_df: DataFrame = Depends(get_spark_df)):
    try:
        return JSONResponse(content=train_rf_model_and_get_student_probabilities(spark_df))
    except Exception as e:
        raise HTTPException(status_code=500,detail=str(e))    
    

# ✅ FastAPI endpoint
#http://localhost:3001/performance_summary
@app.get("/performance_summary")
def performance_analysis(spark_df: DataFrame = Depends(get_spark_df)):
    try:
        summary = train_rf_model_and_get_performance_summary(spark_df)
        return JSONResponse(content=summary)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
# @app.get("/student_predictions")
# def student_predictions(spark_df: DataFrame = Depends(get_spark_df)):
#     try:
#         predictions = train_rf_model_and_get_student_predictions(spark_df)
#         return JSONResponse(content=predictions)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e)) 

# @app.get("/performance_summary")
# def performance_summary(spark_df: DataFrame = Depends(get_spark_df)):
#     try:
#         summary = train_rf_model_and_get_performance_summary(spark_df)
#         return JSONResponse(content=summary)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
        

# @app.get("/student_prediction_full")
# def student_prediction_full(spark_df: DataFrame = Depends(get_spark_df)):
#     try:
#         return train_rf_model_and_get_student_predictions(spark_df)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


@app.post("/predict_user")
def predict_user_performance(user_input: StudentInput):
    print("rf_model is None?", ModelState.rf_model is None)
    try:
        result = predict_student_from_input(user_input.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/model/performance")
def get_model_performance():
    if not ModelState.last_metrics:
        return {"error": "Model not trained yet"}
    return ModelState.last_metrics


@app.get("/quiz-summary")
def quiz_summary(spark_df: DataFrame = Depends(get_spark_df)):
    try:
        return JSONResponse(content=get_quiz_summary_by_course(spark_df))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# POST API FOR UserInput

# @app.post("/predict_user")
# def predict_user_performance(user_input: StudentInput):
#     print("rf_model is None?", rf_model is None)  # Add this
    
#     try:
#         result = predict_student_from_input(user_input.dict())
#         return result
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
    
# @app.get("/model/performance")
# def get_model_performance():
#     if not last_metrics:
#         return {"error": "Model not trained yet"}
#     return last_metrics    

@app.get("/random-forest-regression")
def fetch_random_forest_regression(data: pd.DataFrame = Depends(get_pandas_data)):
    try:
        labels, predictions = perform_random_forest_regression(data)
        return JSONResponse(content={"labels": labels, "data": predictions})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/perform_attendance_trend_analysis/{limits}")
def fetch_attendance_trends(limits: str, data: pd.DataFrame = Depends(get_pandas_data)):
    try:
        return JSONResponse(content=perform_attendance_trend_analysis(data, limits))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# LMS endpoints remain unchanged...
@app.get("/course-engagement")
def course_engagement(spark_df: DataFrame = Depends(get_spark_df)):
    try:
        return JSONResponse(content=get_course_engagement_metrics(spark_df))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/student-performance")
def student_perf(spark_df: DataFrame = Depends(get_spark_df)):
    try:
        return JSONResponse(content=get_student_performance(spark_df))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/assignment-summary")
def assignment_summary(spark_df: DataFrame = Depends(get_spark_df)):
    try:
        return JSONResponse(content=get_assignment_by_course(spark_df))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    

@app.get("/action-distribution")
def action_dist(spark_df: DataFrame = Depends(get_spark_df)):
    try:
        return JSONResponse(content=get_action_type_distribution(spark_df))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Demographics...
@app.get("/demographic-summary")
def demo_summary(spark_df: DataFrame = Depends(get_spark_df)):
    try:
        return JSONResponse(content=get_demographic_summary(spark_df))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/educational-insights")
def edu_insights(spark_df: DataFrame = Depends(get_spark_df)):
    try:
        return JSONResponse(content=get_educational_insights(spark_df))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/students_statistics")
def students_stats(spark_df: DataFrame = Depends(get_spark_df)):
    try:
        return JSONResponse(content=get_overall_student_statistics(spark_df))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/risk-analysis")
def risk_analysis(spark_df: DataFrame = Depends(get_spark_df)):
    try:
        return JSONResponse(content=get_risk_analysis(spark_df))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Student specific
@app.get("/student/{student_id}")
def student_dashboard(student_id: str, spark_df: DataFrame = Depends(get_spark_df)):
    try:
        return JSONResponse(content=get_student_dashboard_data(spark_df, spark_df, spark_df, student_id))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/student_course_wise/{student_id}")
def student_course_avg(student_id: str, spark_df: DataFrame = Depends(get_spark_df)):
    try:
        return JSONResponse(content=get_course_avg(spark_df, student_id))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/student_attendance_trends/{student_id}/{limits}")
def student_attendance_trends(student_id: str, limits: str, data: pd.DataFrame = Depends(get_pandas_data)):
    try:
        return JSONResponse(content=perform_attendance_trend_analysis_student(data, student_id, limits))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/teacher/{course_id}")
def teacher_view(course_id: str, spark: SparkSession = Depends(get_spark_session), spark_df: DataFrame = Depends(get_spark_df)):
    try:
        return JSONResponse(content=get_course_overview(spark, spark_df, spark_df, spark_df, course_id))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@app.get("/teacher")
def teacher_view(
    spark: SparkSession = Depends(get_spark_session),
    spark_df: DataFrame = Depends(get_spark_df)
):
    try:
        metrics = get_course_overview(spark, spark_df, spark_df, spark_df)
        return JSONResponse(content=metrics)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    
    

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return JSONResponse(status_code=500, content={"message": f"Unexpected error: {str(exc)}"})

def main(argv=sys.argv[1:]):
    import argparse

    parser = argparse.ArgumentParser(description="Start the Attendance Analytics API server.")
    parser.add_argument("--host", type=str, default="0.0.0.0", help="Host address to bind the server")
    parser.add_argument("--port", type=int, default=3001, help="Port number to bind the server")
    parser.add_argument("--debug", action="store_true", help="Enable debug mode for live reloading")

    args = parser.parse_args(argv)

    try:
        print(f"Starting server on {args.host}:{args.port} with debug={args.debug}")
        uvicorn.run("server:app", host=args.host, port=args.port, reload=args.debug)
    except KeyboardInterrupt:
        print("\nServer shutdown initiated by user.")
    except Exception as e:
        print(f"An error occurred while running the server: {e}")
    finally:
        print("Server has been stopped.")

if __name__ == "__main__":
    main()