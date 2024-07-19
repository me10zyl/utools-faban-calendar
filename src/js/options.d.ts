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
    basePath?: string,
    /**
     *
     */
    bakPath?: string,
    /**
     * SMMS授权token
     */
    smmsToken?: string,
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
    /**
     * 类型的中文文本
     */
    typeString: string
}
export interface Env {
    /**
     * 环境名称
     */
    envName: string,
    /**
     * 发版分支名称
     */
    fabanBranchName: string,
    /**
     * 项目路径
     */
    projectPath?: string,
    /**
     * 环境测试地址
     */
    envTestUrl: string,
    /**
     * jenkins地址
     */
    jenkinsUrl: string,
    /**
     * jenkins账号
     */
    jenkinsUsername?: string,
    /**
     * jenkins密码或token
     */
    jenkinsPasswordOrToken?: string
    /**
     * 状态
     */
    statusMergedCmd?: string
    /**
     * 发版命令
     */
    publishCmd?: string,
    /**
     * 合并代码命令
     */
    mergeBranchCmd?: string,
    /**
     * 状态查询命令
     */
    statusCmd?: string,
    /**
     * 程序运行开始时间
     */
    statusStartTimeCmd?: string,
}

export interface Options {
    defaultOptions: DefaultOptions,
    projects: Project[]
}
export interface Project {
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
     * 正式环境分支
     */
    releaseBranch?: string
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