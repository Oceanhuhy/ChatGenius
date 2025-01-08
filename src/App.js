import {
  Attachments,
  Bubble,
  Conversations,
  Prompts,
  Sender,
  Welcome,
  useXAgent,
  useXChat, XRequest,
} from '@ant-design/x';
import { createStyles } from 'antd-style';
import React, { useEffect } from 'react';
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
  UserOutlined
} from '@ant-design/icons';
import { Badge, Button, Space, Spin } from 'antd';
import axios from 'axios';
import { marked } from 'marked';

const renderTitle = (icon, title) => (
  <Space align="start">
    {icon}
    <span>{title}</span>
  </Space>
);
const defaultConversationsItems = [
  {
    key: '0',
    label: '会话0',
  },{
    key: '1',
    label: '会话1',
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
        key: '1-1',
        icon: <HeartOutlined />,
        description: `你是谁?`,
      },
      {
        key: '1-2',
        icon: <SmileOutlined />,
        description: `讲个笑话?`,
      },
      {
        key: '1-3',
        icon: <CommentOutlined />,
        description: `你会什么?`,
      },
    ],
  },
  {
    key: '2',
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
        key: '2-1',
        icon: <HeartOutlined />,
        description: `党建学习`,
      },
      {
        key: '2-2',
        icon: <SmileOutlined />,
        description: `公司制度`,
      },
      {
        key: '2-3',
        icon: <CommentOutlined />,
        description: `通知公告`,
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
  // const [lines, setLines] = React.useState([]);

  const [aaa, setAaa] = React.useState([]);

  const [bbb, setBbb] = React.useState([]);

  const changecontext = (key) => {
    const formattedText = { __html: `<div class="custom-style">${marked(key)}</div>` };
    return <div dangerouslySetInnerHTML={formattedText}></div>;
  };

  // ==================== Runtime ====================
  const [agent] = useXAgent({
    request: async ({ message }, { onSuccess }) => {
      setStatus('loading');
      const msg = [{
        role: 'user',
        content: message,
      }];

      await axios.post('/agent/chatmodel', msg)
      .then(function (response) {
        console.log(response);
        setStatus('success');
        
        onSuccess(changecontext(response.data.choices[0].message.content));
      })
      .catch(function (error) {
        console.log(`url: /agent/chatmodel, data: ${JSON.stringify(msg)}, error: ${error}`);
        setStatus('error');
      });
    },
  });

  const { onRequest, messages, setMessages } = useXChat({
    agent,
  });

  // 根据key获取消息列表的函数
  const getMessagesForConversation = (key) => {
    if(key==='0'){
      return aaa;
    }else{
      return bbb;
    }
  };

  console.log(messages);

  //切换会话
  useEffect(() => {
    if (activeKey !== undefined) {
      var newMsg = getMessagesForConversation(activeKey);
      setMessages(newMsg);
    }
    // eslint-disable-next-line
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

  //会话管理
  const onAddConversation = () => {
    setConversationsItems([
      ...conversationsItems,
      {
        key: `${conversationsItems.length}`,
        label: `会话 ${conversationsItems.length}`,
      },
    ]);
    setActiveKey(`${conversationsItems.length}`);
  };

  const onConversationClick = (key) => {
    console.log(activeKey,'==messages==',messages);
    if(activeKey==='0'){
      setAaa(messages);
    }else{
      setBbb(messages);
    }
    setActiveKey(key);
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
        onItemClick={onPromptsItemClick}
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
    </div>
  );
};
export default Independent;