export interface DefaultOptions {
    /**
     * 默认显示SQL
     */
    defaultShowSQL: boolean,
    /**
     * 默认显示配置中心
     */
    defaultShowConfCenter: boolean,
    /**
     * 默认配置中心名称
     */
    defaultConfCenterName: string,
    /**
     * 默认显示项目信息
     */
    defaultShowProjectInfo: boolean,
    /**
     * 默认自定义表单
     */
    defaultCustomForms: CustomForm[],
    /**
     * 默认环境
     */
    defaultEnvs : Env[],
    /**
     * 项目基础路径
     */
    basePath?: string
}
export type CustomType = 'checkbox' | 'input' | 'button';
export type CustomTypeLabel = '复选框' | '输入框' | '按钮'
export type Status = 'started' | 'stopped' | 'starting'
export interface CustomForm {
    /**
     * 类型
     */
    type: CustomType,
    /**
     * 自定义按钮执行的命令
     */
    buttonCmd?: string,
    /**
     * 标签
     */
    label: string,
    typeString: string,
    value?: string|boolean
}

export interface Env {
    /**
     * 环境名称
     */
    envName: string,
    /**
     * 是否已发布
     */
    isPublished: boolean,
    /**
     * 是否已合并到发版分支
     */
    isMergedFabanBranch: boolean,
    /**
     * 发版分支名称
     */
    fabanBranchName: string,
    /**
     * 项目路径
     */
    projectPath?: string,
    /**
     * 发版命令
     */
    publishCmd?: string,
    /**
     * 状态查询命令
     */
    statusCmd?: string,
    /**
     * 程序运行开始时间
     */
    startTimeCmd?: string,
    /**
     * 程序状态
     */
    status?: Status,
    /**
     * 运行开始时间
     */
    startTime: string,
    /**
     * 环境测试地址
     */
    envTestUrl: string,
    /**
     * jenkins地址
     */
    jenkinsUrl: string,
    /**
     * 合并代码命令
     */
    mergeBranchCmd?: string,
}

export interface Options {
    defaultOptions: DefaultOptions,
    projects: Project[]
}
export interface Project {
    /**
     * 选择的项目名称
     */
    selectProjectName?: string,
    /**
     * 分支
     */
    branch: string,
    /**
     * 项目名称
     */
    projectName: string,
    /**
     * 显示SQL
     */
    showSQL: boolean,
    /**
     * 显示配置中心
     */
    showConfigCenter: boolean,
    /**
     * 配置中心名称
     */
    configCenterName: string,
    /**
     * 项目表
     */
    projectDesc: string,
    /**
     * 新分支命令
     */
    newBranchCmd?: string,
    /**
     * git地址
     */
    gitUrl?: string,
    /**
     * 源码基础路径
     */
    projectBasePath?: string,
    /**
     * 是否显示项目信息
     */
    showProjectInfo: boolean,
    /**
     * 自定义表单
     */
    customForms: CustomForm[],
    /**
     * 环境
     */
    envs: Env[]
}