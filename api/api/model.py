import requests
import json
from config.setting import MODEL,API_KEY
from openai import OpenAI
# from zhipuai import ZhipuAI
from flask import Blueprint, jsonify, request

bp = Blueprint('model', __name__, url_prefix='/api/model')

# todo
# 1.使用redis保存用户会话信息
# 2.实现用户对话的上下文关联
# 3.实现知识库问答接口
# 4.对接知识库问答接口
# 5.实现问答模式的切换
# 6.实现智能体应用的开发

# import os
# from openai import OpenAI
# ﻿
# client = OpenAI(
#     # 请用知识引擎原子能力API Key将下行替换为：api_key="sk-xxx",
#     api_key="LKEAP_API_KEY", # 如何获取API Key：https://cloud.tencent.com/document/product/1772/115970
#     base_url="https://api.lkeap.cloud.tencent.com/v1",
# )
# ﻿
# completion = client.chat.completions.create(
#     model="deepseek-r1",  # 此处以 deepseek-r1 为例，可按需更换模型名称。
#     messages=[
#         {'role': 'user', 'content': '9.9和9.11谁大'}
#         ]
# )
# ﻿
# # 通过reasoning_content字段打印思考过程
# print("思考过程：")
# print(completion.choices[0].message.reasoning_content)
# # 通过content字段打印最终答案
# print("最终答案：")
# print(completion.choices[0].message.content)

@bp.route('/chat', methods=['POST'])
def chat():
    data = request.json
    chatModel = data['chatModel']
    print(data)
    if chatModel == 'knowledgeBaseQA':
        return knowledge()
    elif chatModel == 'intelligentAgent':
        print("智能体应用")
    else:
        return basicChat()

# 大模型问答接口
@bp.route('/basicChat', methods=['POST'])
def basicChat():
    data = request.json
    messages = data['msg']

    initMessage = {
        "role": "system",
        "content": "你是一个乐于解答各种问题的助手，你的任务是为用户提供专业、准确、有见地的建议，返回结果使用普通的markdown格式。"
    }

    messages.insert(0, initMessage)

    print(data)

    client = OpenAI(
        # 请用知识引擎原子能力API Key将下行替换为：api_key="sk-xxx",
        api_key=API_KEY,
        base_url="https://api.lkeap.cloud.tencent.com/v1",
    )
    response = client.chat.completions.create(
        model=MODEL,
        messages=messages,
    )
    print(response.to_dict())

    # print("思考过程：")
    # print(response.choices[0].message.reasoning_content)
    # 通过content字段打印最终答案
    print("最终答案：")
    print(response.choices[0].message.content)

    return jsonify({"code": 200, "data": response.choices[0].message.content, "msg": "查询成功"})

# 智普大模型问答接口
# @bp.route('/chat', methods=['POST'])
# def chatmodel():
#     data = request.json
#     messages = data['msg']
#
#     initMessage = {
#         "role": "system",
#         "content": "你是一个乐于解答各种问题的助手，你的任务是为用户提供专业、准确、有见地的建议。"
#     }
#
#     messages.insert(0, initMessage)
#
#     print(data)
#
#     client = ZhipuAI(api_key=API_KEY)
#     response = client.chat.completions.create(
#         model=MODEL,
#         messages=messages,
#     )
#     print(response.to_dict())
#     return response.to_dict()

@bp.route('/knowledge', methods=['POST'])
def knowledge():
    # 接口地址
    data = request.json
    messages = data['msg'][0]['content']

    sessionsUrl = 'http://192.168.111.150:8081/api/v1/chats/ae5ab7dca55311ef8fcb0242ac120006/sessions'
    chatUrl = 'http://192.168.111.150:8081/api/v1/chats/ae5ab7dca55311ef8fcb0242ac120006/completions'
    # 设置请求头
    headers = {
        'Authorization': 'Bearer ragflow-IyN2EyYzY2YTU2MzExZWZhNjBjMDI0Mm',
        'Content-Type': 'application/json'  # 确保Content-Type是application/json
    }

    # 发送POST请求，stream=True表示启用流式请求
    sessionRes = requests.post(sessionsUrl, headers=headers, data=json.dumps({"name": "react session 1"}), stream=False)

    # 检查请求是否成功
    if sessionRes.status_code == 200:
        sessionResult = json.loads(sessionRes.text)
        sessionId = sessionResult['data']['id']
        chatData = json.dumps({
          "question": messages,
          "stream": False,
          "session_id": sessionId
        })
        chatRes = requests.post(chatUrl, headers=headers, data=chatData, stream=False)
        if chatRes.status_code == 200:
            chatResult = json.loads(chatRes.text)
            return jsonify({"code": 200, "data": chatResult['data']['answer'], "msg": "查询成功"})
        else:
            chatResult = json.loads(chatRes.text)
            return jsonify({"code": chatRes.status_code, "data": chatResult['data']['answer'], "msg": "查询失败"})
    else:
        print("请求失败: {}".format(sessionRes.text))
        sessionResult = json.loads(sessionRes.text)
        return jsonify({"code": sessionRes.status_code, "data": sessionResult['data']['answer'], "msg": "查询失败"})

@bp.route('/agent', methods=['POST'])
def agent():
    print("=======", request.json)
    return jsonify({"code": 0, "data": "智能体智能体智能体", "msg": "查询成功"})