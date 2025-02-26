import {
  Attachments,
  Bubble,
  Conversations,
  Prompts,
  Sender,
  Welcome,
  useXAgent,
  useXChat, XRequest,
  ConversationsProps,
} from '@ant-design/x';
import { createStyles } from 'antd-style';
import React, { useEffect, useRef } from 'react';
import {
  CloudUploadOutlined,
  CommentOutlined,
  EllipsisOutlined,
  FireOutlined,
  HeartOutlined,
  PaperClipOutlined,
  PlusOutlined,
  ReadOutlined,
  ShareAltOutlined,
  RobotOutlined,
  SmileOutlined,
  UserOutlined,
  DeleteOutlined, EditOutlined, StopOutlined
} from '@ant-design/icons';
import { Badge, Button, Space, Spin, Modal, Input, Popconfirm, Flex, Switch, Typography } from 'antd';
import axios from 'axios';
import { marked } from 'marked';
import Cookies from 'js-cookie';

const API_BASE = "/api";

const renderTitle = (icon, title) => (
  <Space align="start">
    {icon}
    <span>{title}</span>
  </Space>
);
const defaultConversationsItems = [
  {
    key: '0',
    label: '会话 0',
  },
];
const useStyle = createStyles(({ token, css }) => {
  return {
    layout: css`
      width: 100%;
      min-width: 1000px;
      height: 100vh;
      border-radius: ${token.borderRadius}px;
      display: flex;
      background: ${token.colorBgContainer};
      font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;

      .ant-prompts {
        color: ${token.colorText};
      }
    `,
    menu: css`
      background: ${token.colorBgLayout}80;
      width: 280px;
      height: 100%;
      display: flex;
      flex-direction: column;
    `,
    conversations: css`
      padding: 0 12px;
      flex: 1;
      overflow-y: auto;
    `,
    chat: css`
      height: 100%;
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      padding: ${token.paddingLG}px;
      gap: 16px;
      // border: 1px solid #d9d9d9;
      // border-radius: 10px;
    `,
    messages: css`
      flex: 1;
    `,
    placeholder: css`
      padding-top: 32px;
    `,
    sender: css`
      box-shadow: ${token.boxShadow};
    `,
    logo: css`
      display: flex;
      height: 72px;
      align-items: center;
      justify-content: start;
      padding: 0 24px;
      box-sizing: border-box;

      img {
        width: 50px;
        height: 50px;
        display: inline-block;
      }

      span {
        display: inline-block;
        margin: 0 8px;
        font-weight: bold;
        color: ${token.colorText};
        font-size: 16px;
      }
    `,
    addBtn: css`
      background: #1677ff0f;
      border: 1px solid #1677ff34;
      width: calc(100% - 24px);
      margin: 0 12px 24px 12px;
    `,
  };
});
const placeholderPromptsItems = [
  {
    key: '1',
    label: renderTitle(
      <ReadOutlined
        style={{
          color: '#1890FF',
        }}
      />,
      '知识库问答',
    ),
    
    description: '基于知识库的智能问答',
    children: [
      {
        key: '1-1',
        icon: <HeartOutlined />,
        description: `党建学习`,
      },
      {
        key: '1-2',
        icon: <SmileOutlined />,
        description: `公司制度`,
      },
      {
        key: '1-3',
        icon: <CommentOutlined />,
        description: `通知公告`,
      },
    ],
  },
  {
    key: '2',
    label: renderTitle(
      <FireOutlined
        style={{
          color: '#FF4D4F',
        }}
      />,
      '大语言模型',
    ),
    description: '基于大模型的智能问答',
    children: [
      {
        key: '2-1',
        icon: <HeartOutlined />,
        description: `公文写作`,
      },
      {
        key: '2-2',
        icon: <SmileOutlined />,
        description: `会议纪要`,
      },
      {
        key: '2-3',
        icon: <CommentOutlined />,
        description: `工作总结`,
      },
    ],
  },
  {
    key: '3',
    label: renderTitle(
      <RobotOutlined
        style={{
          color: '#1890FF',
        }}
      />,
      '智能体应用',
    ),
    description: '基于智能体的效率工具',
    children: [
      {
        key: '3-1',
        icon: <HeartOutlined />,
        description: `智能审批`,
      },
      {
        key: '2-2',
        icon: <SmileOutlined />,
        description: `智能提报`,
      },
      {
        key: '2-3',
        icon: <CommentOutlined />,
        description: `智能办公`,
      },
    ],
  },
];
const roles = {
  ai: {
    placement: 'start',
    avatar: {
      icon: <UserOutlined />,
      style: {
        background: '#fde3cf',
      },
    },
    typing: {
      step: 5,
      interval: 40,
    },
    styles: {
      content: {
        borderRadius: 16,
      },
    },
    loadingRender: () => (
      <Space>
        <Spin size="small" />
        Custom loading...
      </Space>
    ),
    // header: '智能客服'
  },
  local: {
    placement: 'end',
    variant: 'shadow',
    avatar: {
      icon: <UserOutlined />,
      style: {
        background: '#87d068',
      },
    },
  },
};

const Independent = () => {
  // ==================== Style ====================
  const { styles } = useStyle();

  // ==================== State ====================
  // const [headerOpen, setHeaderOpen] = React.useState(false);
  const [content, setContent] = React.useState('');
  const [conversationsItems, setConversationsItems] = React.useState(defaultConversationsItems);
  const [activeKey, setActiveKey] = React.useState(defaultConversationsItems[0].key);
  // const [attachedFiles, setAttachedFiles] = React.useState([]);
  const [status, setStatus] = React.useState();
  const hasRun = useRef(false);
  // 初始化状态，默认开启 "基础问答"
  const [selected, setSelected] = React.useState('basicQA');
  const selectedRef = useRef();
  selectedRef.current = selected;
  // const [lines, setLines] = React.useState([]);

  const changecontext = (key) => {
    const formattedText = { __html: `<div class="custom-style">${marked(key)}</div>` };
    return <div dangerouslySetInnerHTML={formattedText}></div>;
  };

  const changeHistory = (text) => {
    const formattedText = { __html: text };
    return <div dangerouslySetInnerHTML={formattedText}></div>;
  };

  // ==================== Runtime ====================
  const [agent] = useXAgent({
    request: async ({ message }, { onSuccess }) => {
      setStatus('loading');
      const data = {
        userId: Cookies.get('userId'),
        chatId: activeKey,
        chatModel: selectedRef.current,
        msg: [{
          role: 'user',
          content: message,
        }]
      };

      await axios.post('/api/model/chat', data)
      .then(function (response) {
        setStatus('success');
        console.log('response',response)
        onSuccess(changecontext(response.data.data));
      })
      .catch(function (error) {
        console.log(`url: /model/chat, data: ${JSON.stringify(data)}, error: ${error}`);
        setStatus('error');
      });      
    },
  });

  const { onRequest, messages, setMessages } = useXChat({
    agent,
  });

  const setMessagesForConversation = (key,msgs) => {
    const data = {
      userId: Cookies.get('userId'),
      chatId: key,
      messages: msgs
    };
    axios.post('/api/session/setchatsession', data)
      .then(function (response) {
      })
      .catch(function (error) {
        console.log(`url: /session/getchatsession, data: ${JSON.stringify(data)}, error: ${error}`);
        setStatus('error');
      });
    
  }

  // 根据key获取消息列表的函数
  const getMessagesForConversation = (key) => {
    const data = {
      userId: Cookies.get('userId'),
      chatId: key
    };

    axios.post('/api/session/getchatsession', data)
      .then(function (response) {
        const transformedData = response.data.map(item => {
          const content = typeof item.message === 'object' 
                          ? changeHistory(item.message.props.dangerouslySetInnerHTML.__html)
                          : item.message;
          return {
            id: item.id,
            message: content,
            status: item.status
          };
        });

        setMessages(transformedData);
    })
  };

  //页面刷新时执行，只执行一次
  useEffect(() => {
    if (!hasRun.current) {
      //展示用户的消息列表
      showConversationsItems();
      hasRun.current = true;
    }

  }, []);

  //切换会话
  useEffect(() => {
    if (activeKey !== undefined) {
      //切换会话时展示对应的聊天消息
      getMessagesForConversation(activeKey)
    }
  }, [activeKey]);

  

  // ==================== Event ====================
  const onSubmit = (nextContent) => {
    if (!nextContent) return;
    onRequest(nextContent);
    setContent('');
  };
  const onPromptsItemClick = (info) => {
    onRequest(info.data.description);
  };

  //获取会话列表
  const showConversationsItems = () => {
    const data = {
      userId: Cookies.get('userId')
    };
    axios.post('/api/session/showconversationsitems', data)
      .then(function (response) {
        if(response.data.length>0){
          setConversationsItems(response.data);
        }
      })
      .catch(function (error) {
        console.log(`url: /session/showconversationsitems, data: ${JSON.stringify(data)}, error: ${error}`);
        setStatus('error');
      });
  }

  //保存会话列表
  const saveConversationsItems = (items) => {
    const data = {
      userId: Cookies.get('userId'),
      conversationsItems: items
    };
    axios.post('/api/session/saveconversationsitems', data)
      .then(function (response) {
      })
      .catch(function (error) {
        console.log(`url: /session/saveconversationsitems, data: ${JSON.stringify(data)}, error: ${error}`);
        setStatus('error');
      });
  }

  //添加会话
  const onAddConversation = () => {
    if(status!=='loading'){
      setConversationsItems(items => {
        const newItems = [
          ...conversationsItems,
          {
            key: `${conversationsItems.length}`,
            label: `会话 ${conversationsItems.length}`,
          },
        ]
        saveConversationsItems(newItems);
        return newItems;
      });
      setMessagesForConversation(activeKey,messages);
      setActiveKey(`${conversationsItems.length}`);
    }
  };

  //会话切换
  const onConversationClick = (key) => {
    if(status!=='loading'){
      setMessagesForConversation(activeKey,messages);
      setActiveKey(key);
    }
  };
  // const handleFileChange = (info) => setAttachedFiles(info.fileList);

  // ==================== Nodes ====================
  const placeholderNode = (
    <Space direction="vertical" size={16} className={styles.placeholder}>
      <Welcome
        variant="borderless"
        icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
        title="Hi，我是智能客服，很高兴见到你！"
        description="基于大模型、知识库和智能体，构建智慧办公新体验~"
      />
      <Prompts
        // title="有什么可以帮你的?"
        items={placeholderPromptsItems}
        styles={{
          list: {
            width: '752px',
          },
          item: {
            flex: 'none',
            width: 'calc(30% - 6px)',
            backgroundImage: `linear-gradient(137deg, #e5f4ff 0%, #efe7ff 100%)`,
            border: 0,
            flex: 1,
          },
          subItem: {
            background: 'rgba(255,255,255,0.45)',
            border: '1px solid #FFF',
          },
        }}
        // onItemClick={onPromptsItemClick}
      />
    </Space>
  );

  const items = messages.map(({ id, message, status }) => ({
    key: id,
    loading: status === 'loading',
    role: status === 'local' ? 'local' : 'ai',
    content: message,
  }));

  const logoNode = (
    <div className={styles.logo}>
      <img
        src="/WechatIMG78.jpg"
        draggable={false}
        alt="logo"
      />
      <span>大数据资产运营</span>
    </div>
  );

  // ==================== 会话管理操作 =================
  const menuConfig = (conversation) => ({
    items: [
      {
        label: '重命名',
        key: 'rename',
        icon: <EditOutlined />,
      },
      {
        label: '删除',
        key: 'delete',
        icon: <DeleteOutlined />,
        danger: true,
      },
    ],
    onClick: (menuInfo) => {
      if(menuInfo['key'] === 'rename') {
        showModal(conversation)
      }else if(menuInfo['key'] === 'delete') {
        showDelModal(conversation)
      }
    },
  });

  // 修改
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [newConversation, setNewConversation] = React.useState({});

  const updateLabelByKey = (key, newLabel) => {
    const updatedItems = conversationsItems.map(item => {
      if (item.key === key) {
        return { ...item, label: newLabel };
      }
      return item;
    });
    setConversationsItems(updatedItems);
    saveConversationsItems(updatedItems);
  };

  const showModal = (conversation) => {
    setInputValue(conversation.label);
    setNewConversation({
      key: conversation.key,
      label: conversation.label,
    });
    setIsModalOpen(true);
  };

  const handleOk = () => {
    updateLabelByKey(newConversation.key,inputValue);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // 删除
  const [isModalDelOpen, setIsModalDelOpen] = React.useState(false);
  const [deleteConversation, setDeleteConversation] = React.useState({});

  const deleteLabelByKey = (key) => {
    const updatedItems = conversationsItems.filter(item => item.key !== key);
    setConversationsItems(updatedItems);
    saveConversationsItems(updatedItems);
  };

  const showDelModal = (conversation) => {
    setDeleteConversation({
      key: conversation.key,
      label: conversation.label,
    });
    setIsModalDelOpen(true);
  };
  const handleDelOk = () => {
    deleteLabelByKey(deleteConversation.key);
    setIsModalDelOpen(false);
  };
  const handleDelCancel = () => {
    setIsModalDelOpen(false);
  };

  
  // ==================== 选择框 ==================
  // 处理 Switch 改变事件
  const handleSwitchChange = (value, label) => {
    setSelected(label);
  };

  // ==================== Render =================
  return (
    <div className={styles.layout}>
      {/* 会话管理--隐藏 */}
      <div className={styles.menu}>
        {/* 🌟 Logo */}
        {logoNode}
        {/* 🌟 添加会话 */}
        <Button
          onClick={onAddConversation}
          type="link"
          className={styles.addBtn}
          icon={<PlusOutlined />}
        >
          添加会话
        </Button>
        {/* 🌟 会话管理 */}
        <Conversations
          items={conversationsItems}
          className={styles.conversations}
          activeKey={activeKey}
          onActiveChange={onConversationClick}
          menu={menuConfig}
        />
      </div>

      <div className={styles.chat}>
        {/* 🌟 消息列表 */}
        <Bubble.List
          items={
            items.length > 0
              ? items
              : [
                  {
                    content: placeholderNode,
                    variant: 'borderless',
                  },
                ]
          }
          roles={roles}
          className={styles.messages}
        />
        {/* 🌟 提示词 */}
        {/*<Prompts items={senderPromptsItems} onItemClick={onPromptsItemClick} />*/}
        {/* 🌟 输入框 */}
        <Flex direction="row" gap="middle" align="center">
        <div>
          <Switch
            checked={selected === 'basicQA'}
            onChange={(checked) => handleSwitchChange(checked, 'basicQA')}
            checkedChildren="大模型"
            unCheckedChildren="大模型"
          />
        </div>
        <div>
          <Switch
            checked={selected === 'knowledgeBaseQA'}
            onChange={(checked) => handleSwitchChange(checked, 'knowledgeBaseQA')}
            checkedChildren="知识库"
            unCheckedChildren="知识库"
          />
        </div>
        {/* <div>
          <Switch
            checked={selected === 'intelligentAgent'}
            onChange={(checked) => handleSwitchChange(checked, 'intelligentAgent')}
            checkedChildren="智能体"
            unCheckedChildren="智能体"
          />
        </div> */}
        </Flex>

        <Sender
          value={content}
          // header={senderHeader}
          onSubmit={onSubmit}
          onChange={setContent}
          // prefix={attachmentsNode}
          loading={agent.isRequesting()}
          className={styles.sender}
        />
      </div>

      <Modal title="重命名" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Input
          placeholder="Basic usage"
          value={inputValue}
          onChange={handleInputChange}
        />
      </Modal>
      <Modal title="删除" open={isModalDelOpen} onOk={handleDelOk} onCancel={handleDelCancel}>
        <p>是否确认删除会话{deleteConversation.key}</p>
      </Modal>
    </div>

    
  );
};
export default Independent;