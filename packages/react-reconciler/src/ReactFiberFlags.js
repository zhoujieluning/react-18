export const NoFlags = 0b00000000000000000000000000000000
export const Placement = 0b00000000000000000000000000000010 // 插入
export const Update = 0b00000000000000000000000000000100 // 更新
export const MutationMask = Placement | Update // 