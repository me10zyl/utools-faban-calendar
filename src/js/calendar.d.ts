import {CustomForm, Env, Project} from "./options";

export type Status = 'normal' | 'abandon' | 'finished'

export interface Command{
    commands : CommandItem[],
    exitCode : number
}
export interface CommandItem{
    type: 'stdout' | 'stderr',
    text: string
}
export interface SelectProject extends Partial<Project>{
    /**
     * 选择的项目名称
     */
    selectProjectName: string,
    /**
     * 分支
     */
    branch: string,
    /**
     * 环境
     */
    selectEnvs: SelectEnv[],
    /**
     * 自定义表单
     */
    selectCustomForms: SelectCustomForm[],
    /**
     * SQL
     */
    sql: string,
    /**
     * 是否执行了SQL
     */
    isUpdateSQL: boolean,
    /**
     * 是否更新了配置中心
     */
    isUpdateConfigCenter: boolean,
    /**
     * 更新的配置中心文本
     */
    updateConfigCenterText: string,
    /**
     * 项目信息
     */
    projectInfo: string,
}
export interface SelectCustomForm extends Partial<CustomForm>{
    selectLabel: string
    value: string|boolean
}
export interface SelectEnv extends Partial<Env>{
    /**
     * 环境名称
     */
    selectEnvName:  string
    /**
     * 是否已发布
     */
    isPublished?: boolean,
    /**
     * 是否已合并到发版分支
     */
    isMergedFabanBranch?: boolean,
}
export interface Item{
    /**
     * guid
     */
    id: string,
    /**
     * 需求名称
     */
    reqName: string,
    /**
     * 项目
     */
    projects: SelectProject[],
    /**
     * 创建时间
     */
    createTime: string,
    /**
     * 是否被选中
     */
    selected: boolean,
    /**
     * 状态
     */
    status: Status
}