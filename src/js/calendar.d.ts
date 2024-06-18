import {Project} from "./options";

export type Status = 'normal' | 'abandon'
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
    project: Project,
    /**
     * 选择的项目名称
     */
    selectProjectName: string,
    /**
     * 选择的分支
     */
    selectBranch:  string,
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