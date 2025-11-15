<template>
  <div class="layout-container">
    <div class="layout-container-form flex space-between" >
      <el-input v-model="query.departmentName" placeholder="科室名" style="width: 200px;" class="filter-item" @change="getTableData(true)" />
      <el-input v-model="query.troubleDesc" placeholder="问题描述" style="width: 200px;margin-left:5px;" class="filter-item" @change="getTableData(true)" />
      <el-select v-model="query.departmentType" placeholder="科室类型" clearable style="width: 130px;margin-left:5px;"  class="filter-item">
        <el-option v-for="item in departmentType" :key="item.code" :label="item.desc" :value="item.code" />
      </el-select>
      <el-select v-model="query.type" placeholder="问题类型" clearable class="filter-item" style="width: 130px;margin-left:5px;">
        <el-option v-for="item in repairErrorType" :key="item.code" :label="item.desc" :value="item.code" />
      </el-select>
      <el-select v-model="query.isHard" placeholder="是否疑难" style="width: 140px;margin-left:5px;" class="filter-item" @change="fetchData">
        <el-option v-for="item in baseYesOrNo" :key="item.code" :label="item.desc" :value="item.code" />
      </el-select>
    <div class="layout-container-form-handle">
      <el-button  class="filter-item" :icon="Search" style='margin-left:10px' type="primary"  @click="getTableData(true)">
        查询
      </el-button>
      <el-button  class="filter-item" :icon="Refresh" style='margin-left:10px' type="primary"  @click="refreshSearch(query)">
        重置
      </el-button>
      <el-button  class="add-item" :icon="Plus" style='margin-left:10px' type="primary" @click="handleAdd">
        新增
      </el-button>
      </div>
    </div>
    <div class="layout-container-table">
      <Table
        ref="table"
        v-model:page="page"
        v-loading="loading"
        :showIndex="true"
        :showSelection="true"
        :data="list"
      >
        <el-table-column prop="id" label="编号" align="center" width="150px"/>
        <el-table-column prop ="departmentType" label="科室类型" align="center" >
          <template #default = 'scope'>
            {{getDepartmentNameByCode(scope.row.departmentType)}}
          </template>
        </el-table-column>
        <el-table-column prop ="type" label="错误类型" align="center" >
          <template #default = 'scope'>
            {{getErrorDescByCode(scope.row.type)}}
          </template>
        </el-table-column>
        <el-table-column prop ="isHard" label="是否疑难" align="center" >
          <template #default = 'scope'>
            {{getBaseYesOrNoByCode(scope.row.isHard)}}
          </template>
        </el-table-column>
        <el-table-column prop="departmentName" label="科室名" align="center" />
        <el-table-column prop="troubleDesc" label="故障描述" align="center" />
        <el-table-column label="处理过程(图片)" align="center"  show-overflow-tooltip="true">
          <template #default="scope">
            <div class = "image-preview">
              <el-image v-for="(img,index) in getImages(scope.row.dealProcess)"  style="width:100px; height: 100px;" 
              :key="index"
              :src="img" 
              :preview-src-list="getImages(scope.row.dealProcess)"
              :preview-teleported = 'true'
              >
            </el-image>
            </div>
          </template>
          </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="200">
          <template #default="scope">
            <el-button @click="handleEdit(scope.row)">修改</el-button>
            <el-popconfirm title="删除" @confirm="handleDel(scope.row)">
              <template #reference>
                <el-button type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </Table>
      <Layer :layer="layer" @getTableData="getTableData" v-if="layer.show" />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive } from 'vue'
import { Plus, Search, Delete, Loading ,Refresh} from '@element-plus/icons'
import { Page } from '@/components/table/type'
import { queryData ,deleteData} from '@/api/repair'
import {DEPARTMENT_TYPE} from '@/constant/enums'
import {BASE_YES_OR_NO } from '@/constant/enums'
import {REPAIR_ERROR_TYPE } from '@/constant/enums'
import type { LayerInterface } from '@/components/layer/index.vue'
import Table from '@/components/table/index.vue'
import Layer from './layer.vue'
import { ElMessage } from 'element-plus'


export default {
  name: 'repairTable',
  components:{
    Table,
    Layer
  },
  setup() {
    // 创建映射缓存
    const departmentCodeMap = new Map();
    Object.values(DEPARTMENT_TYPE).forEach(item => {
      departmentCodeMap.set(item.code, item.desc);
    });
    const repairErrorTypeMap = new Map();
    Object.values(REPAIR_ERROR_TYPE).forEach(item => {
      repairErrorTypeMap.set(item.code, item.desc);
    });
    const baseYesOrNoMap = new Map()
    Object.values(BASE_YES_OR_NO).forEach(item => {
      baseYesOrNoMap.set(item.code, item.desc);
    });

    // 存储搜索用的数据
    const query = reactive({
      departmentName: '',
      departmentType: null,
      isHard: null,
      type:null,
      troubleDesc:''
    })

    //查询条件重置
    const refreshSearch = (query:any)=>{
        query.departmentName = ''
        query.departmentType = null
        query.isHard = null
        query.type = null
        query.troubleDesc = ''
        getTableData(true)
    }

    // 弹窗控制器
    const layer: LayerInterface = reactive({
      show: false,
      title: '新增',
      showButton: true
    })
    // 分页参数, 供table使用
    const page: Page = reactive({
      index: 1,
      size: 20,
      total: 0
    })
    //加载
    const loading = ref(true)
    //查询列表数据
    const list = ref([])
    // 获取表格数据
    // params <init> Boolean ，默认为false，用于判断是否需要初始化分页
    const getTableData = (init: boolean) => {
      loading.value = true
      if (init) {
        page.index = 1
      }
      let params = {
        page: page.index,
        pageSize: page.size,
        ...query
      }
      queryData(params).then(res=>{
        page.index =  res.data.page
        page.size = res.data.pageSize
        page.total = res.data.totalCount
        loading.value = false 
        list.value = res.data.dataList
      })
    }
    // 新增弹窗功能
    const handleAdd = () => {
      layer.title = '新增数据'
      layer.show = true
      delete layer.row
    }
    // 编辑弹窗功能
    const handleEdit = (row: object) => {
      layer.title = '编辑数据'
      layer.row = row
      layer.show = true
    }
    // 删除功能
    const handleDel = (row: any) => {
      console.log(row)
      deleteData(row.id)
      .then(res => {
        ElMessage({
          type: 'success',
          message: '删除成功'
        })
        getTableData(true)
      })
    }
    getTableData(true)  
    return {
      departmentType:DEPARTMENT_TYPE,
      repairErrorType:REPAIR_ERROR_TYPE,
      baseYesOrNo:BASE_YES_OR_NO,
      listQuery: {
        page: 1,
        pageSize: 999,
        importance: '',
        departmentName: '',
        departmentType: null,
        isHard: null,
        type:null,
        troubleDesc:''
      },
      listLoading: true,
      departmentCodeMap,
      repairErrorTypeMap,
      baseYesOrNoMap,
      Plus,
      Search,
      Delete,
      page,
      loading,
      list,
      getTableData,
      layer,
      handleAdd,
      handleEdit,
      query,
      handleDel,
      Refresh,
      refreshSearch
    }
  },
  data() {
    return Loading
  },
  methods: {   
    // fetchData() {
    //   let queryData = this.listQuery;
    //   this.loading = true;
    //   query(this.listQuery).then((response) => {
    //     this.loading = false
    //     this.list = response.data.dataList
    //   })
    // },
    getDepartmentNameByCode(depCode:any){
      // this.departmentType.array.forEach(element => {
      //   if(element.code == depCode){
      //     return element.desc
      //   }
      // });
      return this.departmentCodeMap.get(depCode);
    },
    getErrorDescByCode(errorCode:any){
      return this.repairErrorTypeMap.get(errorCode)
    },
    getBaseYesOrNoByCode(baseCode:any){
      return this.baseYesOrNoMap.get(baseCode)
    },
    getImages(images:string){
      return Array.isArray(images) ? images : images.split(',')
    }
  } 
}
</script>
