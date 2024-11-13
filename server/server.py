from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
from sklearn.preprocessing import OneHotEncoder , LabelEncoder , StandardScaler
from pymongo import MongoClient
import pandas as pd
from sklearn.cluster import KMeans
import numpy as np

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb+srv://srixxm:sriramzoro@cluster0.p3er7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["B2Bdb"]  
collection = db["ChurnCollection"] 

model = joblib.load('./model/model.pkl')
encoder = joblib.load('./model/encoder.pkl')
# df = pd.read_csv('./dataset/gretel_generated_table_2024-10-01-05-35-45.csv')

def format_record(row):
    company_details = row.drop('ChurnStatus').to_dict()  
    return {
        'Company_Details': company_details,  
        'ChurnStatus': row['ChurnStatus'], 
        
    }

# @app.route('/import', methods = ['GET'])
# def imcsv():
#     formatted_records = df.apply(format_record, axis=1).to_list()
#     collection.insert_many(formatted_records)
#     return "success"




@app.route('/', methods=['GET'])
def get_data():
    data = list(collection.find({}, {'Company_Details.CompanyName': True, 'ChurnStatus': True}))
    
 
    for item in data:
        item['_id'] = str(item['_id'])  

    return jsonify(data)

# @app.route('/company/<int:company_index>', methods=['GET'])
# def get_company_details(company_index):
 
#     data = list(collection.find())
    
    
#     if 0 <= company_index < len(data):
#         return jsonify(data[company_index])
#     else:
#         return jsonify({"error": "Company not found"}), 404
    
@app.route('/company/<company_name>', methods=['GET'])
def get_company(company_name):
    
    company = collection.find_one({"Company_Details.CompanyName": company_name}, {'_id': 0, 'Company_Details': 1, 'ChurnStatus': True})
    if company:
        return jsonify(company)
    return jsonify({"error": "Company not found"}), 404


@app.route('/cluster', methods=['GET'])
def get_clustering_data():
    data = collection.find({}, {
        'Company_Details.CompanyName': 1, 
        'Company_Details.TotalRevenue': 1, 
        'Company_Details.ContractLength': 1, 
        'Company_Details.MonthsSinceSignup': 1,
        'Company_Details.TotalTransactions': 1,
        'Company_Details.AvgTransactionValue': 1,
        'Company_Details.ProductUsageFrequency': 1,
        'Company_Details.SupportTicketsOpened': 1,
        'Company_Details.SupportTicketResolutionTime': 1,
        'Company_Details.EmailOpenRate': 1,
        'Company_Details.AccountManagerCalls': 1,
        'ChurnStatus': 1
    })
    data_list = list(data)
    record = []
    company_names = []
    for item in data_list:
        record.append({
                        'CompanyName' : item['Company_Details']['CompanyName'],
                        'TotalRevenue' :item['Company_Details']['TotalRevenue'],
                       'ContractLength' : item['Company_Details']['ContractLength'],
                        'MonthsSinceSignup' :  item['Company_Details']['MonthsSinceSignup'],
                        'TotalTransactions' : item['Company_Details']['TotalTransactions'],
                        # 'TotalTransactions' : item['Company_Details']['TotalTransactions'],
                        'AvgTransactionValue' : item['Company_Details']['AvgTransactionValue'],
                        'ProductUsageFrequency' : item['Company_Details']['ProductUsageFrequency'],
                        'SupportTicketsOpened' : item['Company_Details']['SupportTicketsOpened'],
                        'SupportTicketResolutionTime' : item['Company_Details']['SupportTicketResolutionTime'], 
                        'EmailOpenRate' : item['Company_Details']['EmailOpenRate'],
                        'AccountManagerCalls' : item['Company_Details']['AccountManagerCalls'],
                        'ChurnStatus' : item['ChurnStatus']})
        company_names.append(item['Company_Details']['CompanyName'])

    df = pd.DataFrame(record)
    label_encoder = LabelEncoder()
    df['ProductUsageFrequency'] = label_encoder.fit_transform(df['ProductUsageFrequency'])
    features = df[['TotalRevenue', 'ContractLength', 'AccountManagerCalls', 'ProductUsageFrequency',
                   'MonthsSinceSignup', 'TotalTransactions', 'AvgTransactionValue', 'SupportTicketsOpened', 'SupportTicketResolutionTime', 'EmailOpenRate',
                   'ChurnStatus']]

    scaler = StandardScaler()
    X = features.to_numpy()
    data_scaled = scaler.fit_transform(X)

    kmeans = KMeans(n_clusters=3, random_state=42)
    kmeans.fit(data_scaled)
    labels = kmeans.labels_

    result = []
    for i, item in enumerate(data_list):
        result.append({
            'CompanyName': item['Company_Details']['CompanyName'],
            'TotalRevenue': item['Company_Details']['TotalRevenue'],
            'ContractLength': item['Company_Details']['ContractLength'],
            'Cluster': int(labels[i])  
        })

    return jsonify(result)




@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    input_df = pd.DataFrame([data]) 
    input_df.drop('CompanyName', axis=1, inplace=True)

    encoded_features = encoder.transform(input_df[['ProductUsageFrequency']])
    encoded_df = pd.DataFrame(encoded_features, columns=encoder.get_feature_names_out(['ProductUsageFrequency']))

    input_df = pd.concat([input_df, encoded_df], axis=1)
    input_df.drop('ProductUsageFrequency', axis=1, inplace=True)

    prediction = model.predict(input_df)

    mongochurn = int(prediction[0])
    churn_status = prediction[0]
    res = {
        'Company_Details':data,
        'ChurnStatus' : mongochurn
    }

    company_name = data['CompanyName']
    existing_company = collection.find_one({'Company_Details.CompanyName': company_name})
    if existing_company:
        collection.update_one(
            {'Company_Details.CompanyName': company_name},
            {'$set': res}
        )
    else :
        collection.insert_one(res)
    

    return jsonify({'prediction': "Churned" if churn_status ==  1 else "Not Churned"})


if __name__ == '__main__':
    app.run(debug=True)