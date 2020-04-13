# SearchBar  顶部自定义

## attributes - 各节点属性
```
顶部面包屑文字描述  >>>  breadcrumb:'xxx' 
查询条件中文字label长度定义  >>>  labelWidth:'10px' 
查询条件集合  >>>  labelItems:
                      {
                        <!-- 默认格式 -->
                        {
                          prop: 'xxx', // 提交后台字段
                          label: 'xxx', // 查询lebel
                          type: 'input', // 默认值 可不传
                          isShow: true, // 初始化是否显示
                        },
                        <!-- 下拉格式 -->
                        {
                          prop: 'xxx',
                          label: 'xxx',
                          type: 'select',
                          options: [{label:'xxx',value:'xxx'}].map(({label,value}) => {
                            return {
                              label,value
                            }
                          }),
                          isShow: true
                        },
                        <!-- 时间格式 -->
                        {
                          prop: 'xxx',
                          label: 'xxx',
                          type: 'date',
                          format: 'yyyy-MM-dd', // 时间格式转换
                          isShow: false
                        }
                      }
按钮集合  >>>    buttonlist: 
                  {
                    isReload: true,//是否显示刷新按钮
                    isNew: true,//是否显示新增按钮
                    isDelete: true,//是否显示删除按钮
                    isMore:[]//是否显示更多操作列
                  }
```

### @query='xxx'
```
查询事件---在引入组件内声明事件调用
```
### @addnew='xxx'
```
新增事件---在引入组件内声明事件调用
```
### @delete='xxx'
```
删除事件---在引入组件内声明事件调用
```