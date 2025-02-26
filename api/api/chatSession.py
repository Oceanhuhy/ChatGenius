import requests
import json
from config.setting import MODEL,API_KEY
from flask import Blueprint, jsonify, request
from common.redis_operate import redis_db

bp = Blueprint('session', __name__, url_prefix='/api/session')

# 会话管理
@bp.route('/setchatsession', methods=['POST'])
def setChatSession():
    data = request.json
    messages = data['messages']
    userId = data['userId']
    chatId = data['chatId']
    print(f"设置会话{userId + chatId} messages:{json.dumps(messages)}")
    if len(json.dumps(messages)) != 0:
        redis_db.handle_redis_token(userId+chatId, json.dumps(messages))
    return jsonify({"code": 200, "status": "ok", "msg": f"用户{json.dumps(userId)}-{json.dumps(chatId)}会话保存成功!"})

# 会话删除
@bp.route('/delchatsession', methods=['POST'])
def delChatSession():
    data = request.json
    userId = data['userId']
    chatId = data['chatId']
    print(f"删除会话{userId + chatId}")
    redis_db.delete_key(userId+chatId)
    return jsonify({"code": 200, "status": "ok", "msg": f"用户{json.dumps(userId)}-{json.dumps(chatId)}会话删除成功!"})

@bp.route('/getchatsession', methods=['POST'])
def getChatSession():
    data = request.json
    userId = data['userId']
    chatId = data['chatId']
    if(redis_db.exist_redis_token(userId + chatId)):
        redis_message = redis_db.handle_redis_token(userId + chatId)
        if redis_message:
            chatSession = json.loads(redis_message)
            print(f"获取会话{userId + chatId} chatSession:{chatSession}")
            return chatSession
        else:
            print(f"获取会话{userId + chatId} 用户会话为空:", [])
            return []

    else:
        print(f"获取会话{userId + chatId} 不存在用户会话:", [])
        return []

@bp.route('/saveconversationsitems', methods=['POST'])
def saveConversationsItems():
    data = request.json
    userId = data['userId']
    conversationsItems = json.dumps(data['conversationsItems'])
    print(f"设置会话列表{userId} conversationsItems:{conversationsItems}")
    if len(conversationsItems) != 0:
        redis_db.handle_redis_token(userId, conversationsItems)
    return jsonify({"code": 200, "status": "ok", "msg": f"用户{userId}会话列表保存成功!"})

@bp.route('/showconversationsitems', methods=['POST'])
def showConversationsItems():
    data = request.json
    userId = data['userId']
    if (redis_db.exist_redis_token(userId)):
        redis_message = redis_db.handle_redis_token(userId)
        conversationsItems = json.loads(redis_message)
        print(f"获取会话列表{userId} conversationsItems:{conversationsItems}")
        return conversationsItems
    else:
        return [{'key': '0', 'label': '会话 0'}]