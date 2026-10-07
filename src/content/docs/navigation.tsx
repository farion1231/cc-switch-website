import type { ReactNode } from 'react';
import { HelpCircle, Puzzle, Rocket, Server, Users } from 'lucide-react';

export interface DocSection {
  id: string;
  title: string;
  icon?: ReactNode;
  items?: {
    id: string;
    title: string;
  }[];
}

export const defaultDocSections: DocSection[] = [
  {
    id: 'getting-started',
    title: '快速入门',
    icon: <Rocket className="w-4 h-4" />,
    items: [
      { id: 'introduction', title: '软件介绍' },
      { id: 'installation', title: '安装指南' },
      { id: 'interface', title: '界面概览' },
      { id: 'quickstart', title: '快速上手' },
      { id: 'settings', title: '个性化配置' },
    ],
  },
  {
    id: 'providers',
    title: '供应商管理',
    icon: <Users className="w-4 h-4" />,
    items: [
      { id: 'add', title: '添加供应商' },
      { id: 'switch', title: '切换供应商' },
      { id: 'edit', title: '编辑供应商' },
      { id: 'sort-duplicate', title: '排序与复制' },
      { id: 'usage-query', title: '用量查询' },
      { id: 'claude-desktop', title: 'Claude Desktop' },
    ],
  },
  {
    id: 'extensions',
    title: '扩展功能',
    icon: <Puzzle className="w-4 h-4" />,
    items: [
      { id: 'mcp', title: 'MCP 服务器' },
      { id: 'prompts', title: 'Prompts 提示词' },
      { id: 'skills', title: 'Skills 技能' },
      { id: 'sessions', title: '会话管理器' },
      { id: 'workspace', title: '工作区与记忆' },
    ],
  },
  {
    id: 'proxy',
    title: '本地路由与高可用',
    icon: <Server className="w-4 h-4" />,
    items: [
      { id: 'service', title: '本地路由服务' },
      { id: 'routing', title: '应用路由' },
      { id: 'failover', title: '故障转移' },
      { id: 'usage', title: '用量统计' },
      { id: 'model-test', title: '连通检测' },
      { id: 'aggregation', title: '聚合模式' },
    ],
  },
  {
    id: 'faq',
    title: '常见问题',
    icon: <HelpCircle className="w-4 h-4" />,
    items: [
      { id: 'config-files', title: '配置文件说明' },
      { id: 'questions', title: 'FAQ' },
      { id: 'deeplink', title: '深度链接协议' },
      { id: 'env-conflict', title: '环境变量冲突' },
    ],
  },
];

type DocNavTranslations = {
  docs?: {
    nav?: {
      sections?: Record<string, string>;
      items?: Record<string, string>;
    };
  };
};

export function getDocSections(t: DocNavTranslations): DocSection[] {
  const sectionTitles = t.docs?.nav?.sections ?? {};
  const itemTitles = t.docs?.nav?.items ?? {};

  return defaultDocSections.map((section) => ({
    ...section,
    title: sectionTitles[section.id] ?? section.title,
    items: section.items?.map((item) => ({
      ...item,
      title: itemTitles[item.id] ?? item.title,
    })),
  }));
}
