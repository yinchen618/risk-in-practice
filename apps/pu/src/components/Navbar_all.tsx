'use client'

import {
  Activity,
  Atom as AtomIcon,
  BarChart3,
  BookOpen,
  Bot,
  Brain,
  Building,
  Camera,
  Cpu,
  Eye,
  Filter,
  FlaskConical,
  Gamepad2,
  Gauge,
  GitBranch,
  Globe,
  Home,
  Image,
  Languages,
  Layers,
  Menu,
  MessageSquare,
  Mic,
  Microscope,
  Network,
  Palette,
  PenTool,
  Scissors,
  Settings,
  Sparkles,
  Target,
  TreePine,
  TrendingUp,
  Wand2,
  X,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

// 板塊一：核心技術實作 (Core Technology Implementation)
const coreImplementation = [
  {
    name: '線性回歸',
    href: '/linear-regression',
    description: '從零實現線性回歸演算法',
    icon: BarChart3,
  },
  {
    name: '神經網路分類',
    href: '/neural-network',
    description: '多層感知機的完整實現',
    icon: Brain,
  },
  {
    name: '情感分析系統',
    href: '/sentiment',
    description: '基於 RNN/LSTM 的文本情感分析',
    icon: MessageSquare,
  },
  {
    name: '圖片分類器',
    href: '/image-classifier',
    description: 'CNN 圖像分類系統',
    icon: Image,
  },
  {
    name: 'AI 塗鴉識別',
    href: '/doodle-recognition',
    description: '即時手寫識別系統',
    icon: PenTool,
  },
  {
    name: 'Quick Draw AI',
    href: '/quickdraw',
    description: 'Google Quick Draw 風格遊戲',
    icon: Target,
  },
]

// 板塊二：互動式原理剖析 (Interactive Principle Analysis)
const principleAnalysis = [
  {
    name: '神經網路視覺化',
    href: '/neural-network-visualization',
    description: '逐層展示神經網路的內部運作',
    icon: Network,
  },
  {
    name: 'CNN 架構剖析',
    href: '/cnn-visualization',
    description: '卷積神經網路的層級結構分析',
    icon: Layers,
  },
  {
    name: '注意力機制視覺化',
    href: '/attention-mechanism',
    description: '展示 Transformer 注意力權重',
    icon: Target,
  },
  {
    name: 'Transformer 架構',
    href: '/transformer-visualization',
    description: '完整的 Transformer 模型視覺化',
    icon: Activity,
  },
  {
    name: 'RNN 序列建模',
    href: '/rnn-visualization',
    description: '循環神經網路的時序處理機制',
    icon: Cpu,
  },
  {
    name: '梯度下降演示',
    href: '/gradient-descent',
    description: '互動式梯度下降過程',
    icon: TrendingUp,
  },
  {
    name: '反向傳播機制',
    href: '/back-propagation',
    description: '詳細展示梯度反向傳播',
    icon: GitBranch,
  },
]

// 板塊三：弱監督學習 (Weak Supervision Learning)
const weakSupervisionLearning = [
  {
    name: '🏴‍☠️ AI 尋寶挑戰',
    href: '/weak-supervision-challenge',
    description: '遊戲化的 PU Learning 與互補標籤學習體驗',
    icon: Target,
  },
  {
    name: '杉山法分析器',
    href: '/smart-testbed/sugiyama-analyzer',
    description: '協變量偏移與雜訊標籤模擬分析',
    icon: AtomIcon,
  },
  {
    name: 'PU Learning 實驗室',
    href: '/weak-supervision/pu-learning',
    description: '正樣本與未標註學習的深度探索',
    icon: Microscope,
  },
  {
    name: '互補標籤學習',
    href: '/weak-supervision/complementary-learning',
    description: '基於排除法的學習策略研究',
    icon: FlaskConical,
  },
  {
    name: '半監督學習',
    href: '/weak-supervision/semi-supervised',
    description: '少量標籤資料的有效利用方法',
    icon: Brain,
  },
]

// 板塊四：前沿研究探索 (Frontier Research Exploration)
const frontierResearch = [
  {
    name: '互動式模型訓練',
    href: '/model-training',
    description: '可控的科學實驗平台',
    icon: FlaskConical,
  },
  {
    name: '決策樹解釋性',
    href: '/decision-tree',
    description: '可解釋 AI 的經典案例',
    icon: TreePine,
  },
  {
    name: 'GAN 生成對抗',
    href: '/gan-visualization',
    description: '生成對抗網路的訓練動態',
    icon: Sparkles,
  },
  {
    name: '大型語言模型',
    href: '/large-language-model',
    description: '探索 LLM 的內部機制',
    icon: Brain,
  },
  {
    name: 'Stable Diffusion',
    href: '/stable-diffusion',
    description: '擴散模型的生成過程視覺化',
    icon: Wand2,
  },
]

// 板塊五：創意互動體驗 (Creative Interactive Experience)
const creativeInteraction = [
  {
    name: '風格轉換藝術',
    href: '/style-transfer',
    description: '神經風格轉換技術',
    icon: Palette,
  },
  {
    name: '語音轉文字',
    href: '/speech-to-text',
    description: '即時語音識別系統',
    icon: Mic,
  },
  {
    name: 'AI 聊天機器人',
    href: '/chatbot',
    description: '智能對話系統',
    icon: Bot,
  },
  {
    name: 'AI 故事生成',
    href: '/story-generator',
    description: '創意文本生成系統',
    icon: BookOpen,
  },
  {
    name: '物體分割識別',
    href: '/segment-anything',
    description: 'Segment Anything 模型應用',
    icon: Scissors,
  },
  {
    name: 'Vision Transformer',
    href: '/vision-transformer',
    description: '視覺 Transformer 的圖像分類',
    icon: Eye,
  },
  {
    name: 'CLIP 多模態',
    href: '/clip-multimodal',
    description: '文字與圖像的跨模態理解',
    icon: Globe,
  },
  {
    name: 'Neural Radiance Fields',
    href: '/neural-radiance-fields',
    description: '3D 場景重建技術',
    icon: Camera,
  },
]

// 板塊六：經典遊戲 (Classic Games)
const classicGames = [
  {
    name: '貪食蛇 AI 訓練',
    href: '/games/snake',
    description: 'Q-Learning 強化學習演算法訓練 AI 玩貪食蛇',
    icon: Zap,
  },
  {
    name: '2048 遊戲',
    href: '/games/2048',
    description: '經典的數字合併益智遊戲',
    icon: Gamepad2,
  },
  {
    name: '井字遊戲',
    href: '/games/tic-tac-toe',
    description: '經典的三連棋對戰遊戲',
    icon: Target,
  },
]

// 板塊七：智慧實驗場 (Smart Residential Research Testbed)
const smartTestbed = [
  {
    name: '設備感測數據',
    href: '/smart-testbed/sensor-data',
    description: '即時與歷史感測資料瀏覽器',
    icon: Gauge,
  },
  {
    name: '門檻邏輯分析',
    href: '/smart-testbed/threshold-detection',
    description: '自定義門檻值進行異常偵測',
    icon: Filter,
  },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState('zh')
  const pathname = usePathname()

  const languages = [
    { code: 'zh', name: '中文', flag: '🇹🇼' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
  ]

  const handleLanguageChange = (langCode: string) => {
    setCurrentLanguage(langCode)

    // 使用 Google 翻譯
    const googleTranslateUrl = `https://translate.google.com/translate?sl=auto&tl=${langCode}&u=${encodeURIComponent(window.location.href)}`
    window.open(googleTranslateUrl, '_blank')
  }

  const isCoreImplementationPath = coreImplementation.some(feature => pathname === feature.href)
  const isPrincipleAnalysisPath = principleAnalysis.some(feature => pathname === feature.href)
  const isWeakSupervisionPath = weakSupervisionLearning.some(feature => pathname === feature.href)
  const isFrontierResearchPath = frontierResearch.some(feature => pathname === feature.href)
  const isCreativeInteractionPath = creativeInteraction.some(feature => pathname === feature.href)
  const isClassicGamesPath = classicGames.some(feature => pathname === feature.href)
  const isSmartTestbedPath = smartTestbed.some(feature => pathname === feature.href)

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* 左側 Logo + 主選單群組 */}
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
              <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-2">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI 學習平台
              </span>
              <span className="block sm:hidden text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI 平台
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2 ml-4">
              <Link
                href="/"
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                  pathname === '/' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                }`}
              >
                <Home className="h-4 w-4" />
                首頁
              </Link>

              {/* 核心技術實作 Dropdown */}
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={`flex items-center gap-2 ${
                        isCoreImplementationPath ? 'bg-accent text-accent-foreground' : ''
                      }`}
                    >
                      <Settings className="h-4 w-4" />
                      核心技術實作
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="left-0">
                      <div className="grid w-[280px] gap-1 p-2 md:w-[320px] lg:w-[380px] lg:grid-cols-2">
                        {coreImplementation.map(feature => {
                          const Icon = feature.icon
                          return (
                            <NavigationMenuLink key={feature.href} asChild>
                              <Link
                                href={feature.href}
                                className={`flex items-start gap-3 select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
                                  pathname === feature.href ? 'bg-accent' : ''
                                }`}
                              >
                                <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <div className="space-y-1">
                                  <div className="text-sm font-medium leading-none">
                                    {feature.name}
                                  </div>
                                  <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                                    {feature.description}
                                  </p>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          )
                        })}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {/* 互動式原理剖析 Dropdown */}
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={`flex items-center gap-2 ${
                        isPrincipleAnalysisPath ? 'bg-accent text-accent-foreground' : ''
                      }`}
                    >
                      <Network className="h-4 w-4" />
                      互動式原理剖析
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="left-0">
                      <div className="grid w-[280px] gap-1 p-2 md:w-[320px] lg:w-[380px] lg:grid-cols-2">
                        {principleAnalysis.map(feature => {
                          const Icon = feature.icon
                          return (
                            <NavigationMenuLink key={feature.href} asChild>
                              <Link
                                href={feature.href}
                                className={`flex items-start gap-3 select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
                                  pathname === feature.href ? 'bg-accent' : ''
                                }`}
                              >
                                <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <div className="space-y-1">
                                  <div className="text-sm font-medium leading-none">
                                    {feature.name}
                                  </div>
                                  <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                                    {feature.description}
                                  </p>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          )
                        })}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {/* 弱監督學習 Dropdown */}
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={`flex items-center gap-2 ${
                        isWeakSupervisionPath ? 'bg-accent text-accent-foreground' : ''
                      }`}
                    >
                      <Target className="h-4 w-4" />
                      弱監督學習
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="left-0">
                      <div className="grid w-[280px] gap-1 p-2 md:w-[320px] lg:w-[380px] lg:grid-cols-2">
                        {weakSupervisionLearning.map(feature => {
                          const Icon = feature.icon
                          return (
                            <NavigationMenuLink key={feature.href} asChild>
                              <Link
                                href={feature.href}
                                className={`flex items-start gap-3 select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
                                  pathname === feature.href ? 'bg-accent' : ''
                                }`}
                              >
                                <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <div className="space-y-1">
                                  <div className="text-sm font-medium leading-none">
                                    {feature.name}
                                  </div>
                                  <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                                    {feature.description}
                                  </p>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          )
                        })}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {/* 前沿研究探索 Dropdown */}
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={`flex items-center gap-2 ${
                        isFrontierResearchPath ? 'bg-accent text-accent-foreground' : ''
                      }`}
                    >
                      <FlaskConical className="h-4 w-4" />
                      前沿研究探索
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="left-0">
                      <div className="grid w-[280px] gap-1 p-2 md:w-[320px] lg:w-[380px] lg:grid-cols-2">
                        {frontierResearch.map(feature => {
                          const Icon = feature.icon
                          return (
                            <NavigationMenuLink key={feature.href} asChild>
                              <Link
                                href={feature.href}
                                className={`flex items-start gap-3 select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
                                  pathname === feature.href ? 'bg-accent' : ''
                                }`}
                              >
                                <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <div className="space-y-1">
                                  <div className="text-sm font-medium leading-none">
                                    {feature.name}
                                  </div>
                                  <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                                    {feature.description}
                                  </p>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          )
                        })}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {/* 創意互動體驗 Dropdown */}
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={`flex items-center gap-2 ${
                        isCreativeInteractionPath ? 'bg-accent text-accent-foreground' : ''
                      }`}
                    >
                      <Palette className="h-4 w-4" />
                      創意互動體驗
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="left-0">
                      <div className="grid w-[280px] gap-1 p-2 md:w-[320px] lg:w-[380px] lg:grid-cols-2">
                        {creativeInteraction.map(feature => {
                          const Icon = feature.icon
                          return (
                            <NavigationMenuLink key={feature.href} asChild>
                              <Link
                                href={feature.href}
                                className={`flex items-start gap-3 select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
                                  pathname === feature.href ? 'bg-accent' : ''
                                }`}
                              >
                                <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <div className="space-y-1">
                                  <div className="text-sm font-medium leading-none">
                                    {feature.name}
                                  </div>
                                  <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                                    {feature.description}
                                  </p>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          )
                        })}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {/* 經典遊戲 Dropdown */}
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={`flex items-center gap-2 ${
                        isClassicGamesPath ? 'bg-accent text-accent-foreground' : ''
                      }`}
                    >
                      <Gamepad2 className="h-4 w-4" />
                      經典遊戲
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="left-0">
                      <div className="grid w-[280px] gap-1 p-2 md:w-[320px] lg:w-[380px] lg:grid-cols-2">
                        {classicGames.map(feature => {
                          const Icon = feature.icon
                          return (
                            <NavigationMenuLink key={feature.href} asChild>
                              <Link
                                href={feature.href}
                                className={`flex items-start gap-3 select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
                                  pathname === feature.href ? 'bg-accent' : ''
                                }`}
                              >
                                <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <div className="space-y-1">
                                  <div className="text-sm font-medium leading-none">
                                    {feature.name}
                                  </div>
                                  <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                                    {feature.description}
                                  </p>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          )
                        })}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {/* 智慧實驗場 Dropdown */}
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={`flex items-center gap-2 ${
                        isSmartTestbedPath ? 'bg-accent text-accent-foreground' : ''
                      }`}
                    >
                      <Building className="h-4 w-4" />
                      智慧實驗場
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="left-0">
                      <div className="grid w-[280px] gap-1 p-2 md:w-[320px] lg:w-[380px] lg:grid-cols-1">
                        {smartTestbed.map(feature => {
                          const Icon = feature.icon
                          return (
                            <NavigationMenuLink key={feature.href} asChild>
                              <Link
                                href={feature.href}
                                className={`flex items-start gap-3 select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
                                  pathname === feature.href ? 'bg-accent' : ''
                                }`}
                              >
                                <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <div className="space-y-1">
                                  <div className="text-sm font-medium leading-none">
                                    {feature.name}
                                  </div>
                                  <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                                    {feature.description}
                                  </p>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          )
                        })}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Medium Screen Navigation - Simplified */}
            <div className="hidden md:flex lg:hidden items-center space-x-1">
              <Link
                href="/"
                className={`flex items-center gap-1 px-2 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                  pathname === '/' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                }`}
              >
                <Home className="h-4 w-4" />
                首頁
              </Link>

              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="flex items-center gap-1">
                      <Brain className="h-4 w-4" />
                      AI 功能
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="left-0">
                      <div className="w-[250px] p-2">
                        <div className="space-y-1">
                          <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                            核心技術實作
                          </div>
                          {coreImplementation.map(feature => {
                            const Icon = feature.icon
                            return (
                              <NavigationMenuLink key={feature.href} asChild>
                                <Link
                                  href={feature.href}
                                  className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                                    pathname === feature.href ? 'bg-accent' : ''
                                  }`}
                                >
                                  <Icon className="h-4 w-4" />
                                  {feature.name}
                                </Link>
                              </NavigationMenuLink>
                            )
                          })}
                        </div>
                        <div className="space-y-1 mt-3">
                          <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                            互動式原理剖析
                          </div>
                          {principleAnalysis.map(feature => {
                            const Icon = feature.icon
                            return (
                              <NavigationMenuLink key={feature.href} asChild>
                                <Link
                                  href={feature.href}
                                  className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                                    pathname === feature.href ? 'bg-accent' : ''
                                  }`}
                                >
                                  <Icon className="h-4 w-4" />
                                  {feature.name}
                                </Link>
                              </NavigationMenuLink>
                            )
                          })}
                        </div>
                        <div className="space-y-1 mt-3">
                          <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                            弱監督學習
                          </div>
                          {weakSupervisionLearning.map(feature => {
                            const Icon = feature.icon
                            return (
                              <NavigationMenuLink key={feature.href} asChild>
                                <Link
                                  href={feature.href}
                                  className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                                    pathname === feature.href ? 'bg-accent' : ''
                                  }`}
                                >
                                  <Icon className="h-4 w-4" />
                                  {feature.name}
                                </Link>
                              </NavigationMenuLink>
                            )
                          })}
                        </div>
                        <div className="space-y-1 mt-3">
                          <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                            前沿研究探索
                          </div>
                          {frontierResearch.map(feature => {
                            const Icon = feature.icon
                            return (
                              <NavigationMenuLink key={feature.href} asChild>
                                <Link
                                  href={feature.href}
                                  className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                                    pathname === feature.href ? 'bg-accent' : ''
                                  }`}
                                >
                                  <Icon className="h-4 w-4" />
                                  {feature.name}
                                </Link>
                              </NavigationMenuLink>
                            )
                          })}
                        </div>
                        <div className="space-y-1 mt-3">
                          <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                            創意互動體驗
                          </div>
                          {creativeInteraction.map(feature => {
                            const Icon = feature.icon
                            return (
                              <NavigationMenuLink key={feature.href} asChild>
                                <Link
                                  href={feature.href}
                                  className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                                    pathname === feature.href ? 'bg-accent' : ''
                                  }`}
                                >
                                  <Icon className="h-4 w-4" />
                                  {feature.name}
                                </Link>
                              </NavigationMenuLink>
                            )
                          })}
                        </div>
                        <div className="space-y-1 mt-3">
                          <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                            智慧實驗場
                          </div>
                          {smartTestbed.map(feature => {
                            const Icon = feature.icon
                            return (
                              <NavigationMenuLink key={feature.href} asChild>
                                <Link
                                  href={feature.href}
                                  className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                                    pathname === feature.href ? 'bg-accent' : ''
                                  }`}
                                >
                                  <Icon className="h-4 w-4" />
                                  {feature.name}
                                </Link>
                              </NavigationMenuLink>
                            )
                          })}
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">開啟選單</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex items-center justify-between pb-4 mb-4 border-b">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-2">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-bold">AI 學習平台</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex flex-col space-y-3">
                  <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                      pathname === '/'
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <Home className="h-4 w-4" />
                    首頁
                  </Link>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground">
                      <Settings className="h-4 w-4" />
                      核心技術實作
                    </div>
                    <div className="ml-2 space-y-1">
                      {coreImplementation.map(feature => {
                        const Icon = feature.icon
                        return (
                          <Link
                            key={feature.href}
                            href={feature.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                              pathname === feature.href
                                ? 'bg-accent text-accent-foreground'
                                : 'text-muted-foreground'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            {feature.name}
                          </Link>
                        )
                      })}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground">
                      <Network className="h-4 w-4" />
                      互動式原理剖析
                    </div>
                    <div className="ml-2 space-y-1">
                      {principleAnalysis.map(feature => {
                        const Icon = feature.icon
                        return (
                          <Link
                            key={feature.href}
                            href={feature.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                              pathname === feature.href
                                ? 'bg-accent text-accent-foreground'
                                : 'text-muted-foreground'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            {feature.name}
                          </Link>
                        )
                      })}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground">
                      <Target className="h-4 w-4" />
                      弱監督學習
                    </div>
                    <div className="ml-2 space-y-1">
                      {weakSupervisionLearning.map(feature => {
                        const Icon = feature.icon
                        return (
                          <Link
                            key={feature.href}
                            href={feature.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                              pathname === feature.href
                                ? 'bg-accent text-accent-foreground'
                                : 'text-muted-foreground'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            {feature.name}
                          </Link>
                        )
                      })}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground">
                      <FlaskConical className="h-4 w-4" />
                      前沿研究探索
                    </div>
                    <div className="ml-2 space-y-1">
                      {frontierResearch.map(feature => {
                        const Icon = feature.icon
                        return (
                          <Link
                            key={feature.href}
                            href={feature.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                              pathname === feature.href
                                ? 'bg-accent text-accent-foreground'
                                : 'text-muted-foreground'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            {feature.name}
                          </Link>
                        )
                      })}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground">
                      <Palette className="h-4 w-4" />
                      創意互動體驗
                    </div>
                    <div className="ml-2 space-y-1">
                      {creativeInteraction.map(feature => {
                        const Icon = feature.icon
                        return (
                          <Link
                            key={feature.href}
                            href={feature.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                              pathname === feature.href
                                ? 'bg-accent text-accent-foreground'
                                : 'text-muted-foreground'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            {feature.name}
                          </Link>
                        )
                      })}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground">
                      <Gamepad2 className="h-4 w-4" />
                      經典遊戲
                    </div>
                    <div className="ml-2 space-y-1">
                      {classicGames.map(feature => {
                        const Icon = feature.icon
                        return (
                          <Link
                            key={feature.href}
                            href={feature.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                              pathname === feature.href
                                ? 'bg-accent text-accent-foreground'
                                : 'text-muted-foreground'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            {feature.name}
                          </Link>
                        )
                      })}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground">
                      <Building className="h-4 w-4" />
                      智慧實驗場
                    </div>
                    <div className="ml-2 space-y-1">
                      {smartTestbed.map(feature => {
                        const Icon = feature.icon
                        return (
                          <Link
                            key={feature.href}
                            href={feature.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                              pathname === feature.href
                                ? 'bg-accent text-accent-foreground'
                                : 'text-muted-foreground'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            {feature.name}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* 右側語言選單，永遠靠最右 */}
          <div className="flex items-center">
            <NavigationMenu viewport={false}>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="flex items-center gap-2">
                    <Languages className="h-4 w-4" />
                    <span className="text-sm">
                      {languages.find(lang => lang.code === currentLanguage)?.flag}
                      <span className="ml-1 hidden md:inline">
                        {languages.find(lang => lang.code === currentLanguage)?.name}
                      </span>
                    </span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="absolute right-0 z-50 w-64 p-2 bg-background border rounded-md shadow">
                    {languages.map(language => (
                      <button
                        key={language.code}
                        type="button"
                        onClick={() => handleLanguageChange(language.code)}
                        className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                          currentLanguage === language.code
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground'
                        }`}
                      >
                        <span className="text-lg">{language.flag}</span>
                        <span>{language.name}</span>
                      </button>
                    ))}
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
