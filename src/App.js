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
  SmileOutlined,
} from '@ant-design/icons';
import { Badge, Button, Space } from 'antd';
import axios from 'axios';

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
      height: 722px;
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
      max-width: 700px;
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
        width: 24px;
        height: 24px;
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
      'Hot Topics',
    ),
    description: 'What are you interested in?',
    children: [
      {
        key: '1-1',
        description: `你是谁?`,
      },
      {
        key: '1-2',
        description: `讲个笑话?`,
      },
      {
        key: '1-3',
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
      'Design Guide',
    ),
    description: 'How to design a good product?',
    children: [
      {
        key: '2-1',
        icon: <HeartOutlined />,
        description: `Know the well`,
      },
      {
        key: '2-2',
        icon: <SmileOutlined />,
        description: `Set the AI role`,
      },
      {
        key: '2-3',
        icon: <CommentOutlined />,
        description: `Express the feeling`,
      },
    ],
  },
];
const roles = {
  ai: {
    placement: 'start',
    typing: {
      step: 5,
      interval: 20,
    },
    styles: {
      content: {
        borderRadius: 16,
      },
    },
  },
  local: {
    placement: 'end',
    variant: 'shadow',
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

  // ==================== Runtime ====================
  const [agent] = useXAgent({
    request: async ({ message }, { onSuccess }) => {
      setStatus('pending');
      const msg = [{
        role: 'user',
        content: message,
      }];

      await axios.post('/agent/chatmodel', msg)
      .then(function (response) {
        console.log(response);
        setStatus('success');
        onSuccess(response.data.choices[0].message.content);
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

  // var aaa = [
  //   { id: 0, message: '张三张三', variant: 'borderless', status: false },
  //   { id: 1, message: '张三张三张三张三', variant: 'borderless', status: false },
  // ];

  // var bbb = [
  //   { id: 0, message: '李四李四', variant: 'borderless', status: false },
  //   { id: 1, message: '李四李四李四李四', variant: 'borderless', status: false },
  //   { id: 2, message: '李四李四李四李四李四李四', variant: 'borderless', status: false },
  // ];

  // 假设这是获取消息列表的函数
  // const setMessagesForConversation = (key) => {
  //   if(key==='0'){
  //     setAaa(messages);
  //     // aaa=messages;
  //   }else{
  //     setBbb(messages);
  //     // bbb=messages;
  //   }
    
  // };

  // 假设这是获取消息列表的函数
  const getMessagesForConversation = (key) => {
    if(key==='0'){
      return aaa;
    }else{
      return bbb;
    }
  };

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
        label: `New Conversation ${conversationsItems.length}`,
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
        title="Hello, I'm Ant Design X"
        description="Base on Ant Design, AGI product interface solution, create a better intelligent vision~"
      />
      <Prompts
        title="Do you want?"
        items={placeholderPromptsItems}
        styles={{
          list: {
            width: '100%',
          },
          item: {
            flex: 1,
          },
        }}
        onItemClick={onPromptsItemClick}
      />
    </Space>
  );

  var items = messages.map(({ id, message, status }) => ({
    key: id,
    loading: status === 'loading',
    role: status === 'local' ? 'local' : 'ai',
    content: message,
  }));

  // console.log('itemList',itemsList)

  const logoNode = (
    <div className={styles.logo}>
      <img
        src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
        draggable={false}
        alt="logo"
      />
      <span>Ant Design X</span>
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
          New Conversation
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