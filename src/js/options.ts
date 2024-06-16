export interface DefaultOptions {
    defaultShowSQL: boolean,
    defaultShowConfCenter: boolean,
    defaultConfCenterName: string,
    defaultShowProjectInfo: boolean,
    /**
     * 默认自定义表单
     */
    defaultCustomForms: CustomForm[]
}
export type CustomType = 'checkbox' | 'input' | 'button';
export type CustomTypeLabel = '复选框' | '输入框' | '按钮'
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
    typeString: string
}

export interface Env {
    envName: string,
    fabanBranchName: string,
    projectPath: string,
    publishCmd: string,
    statusCmd: string,
    startTimeCmd: string
}

export interface Options {
    defaultOptions: DefaultOptions,
    projects: Project
}
export interface Project {
    branch: string,
    projectName: string,
    showSQL: boolean,
    showConfigCenter: boolean,
    configCenterName: string,
    showProjectRemark: string,
    projectDesc: string,
    newBranchCmd: string,
    gitUrl: string,
    envs: Env[]
}