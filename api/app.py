import os, sys
from config.setting import SERVER_PORT
from flask import Flask
import api.model
import api.chatSession

# 项目根路径
BASE_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_PATH)  # 将项目根路径临时加入环境变量，程序退出后失效

if __name__ == '__main__':
    app = Flask(__name__)
    app.config["JSON_AS_ASCII"] = False

    app.register_blueprint(api.model.bp)
    app.register_blueprint(api.chatSession.bp)
    # host为主机ip地址，port指定访问端口号，debug=True设置调试模式打开
    app.run(host="0.0.0.0", port=SERVER_PORT)
