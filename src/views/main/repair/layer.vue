<template>
  <Layer :layer="layer" @confirm="submit" ref="layerDom">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px" style="margin-right:30px;">
      <el-form-item label="科室类型：" prop="select">
			  <el-select v-model="form.departmentType" placeholder="请选择科室类型" clearable>
					<el-option v-for="item in departmentType" :key="item.code" :label="item.desc" :value="item.code"></el-option>
				</el-select>
			</el-form-item>
      <el-form-item label="科室名：" prop="name">
        <el-input v-model="form.departmentName" placeholder="请输入科室名"></el-input>
      </el-form-item>
      <el-form-item label="错误类型" prop="select">
			  <el-select v-model="form.type" placeholder="请选择错误类型" clearable>
					<el-option v-for="item in repairErrorType" :key="item.code" :label="item.desc" :value="item.code"></el-option>
				</el-select>
			</el-form-item>
      <el-form-item label="问题描述：" prop="name">
        <el-input v-model="form.troubleDesc" placeholder="请输入问题描述"></el-input>
      </el-form-item>
			<el-form-item label="是否疑难：" prop="select">
			  <el-select v-model="form.isHard" placeholder="请选择是否" clearable>
					<el-option v-for="item in baseYesOrNo"  :key="item.code" :label="item.desc" :value="item.code"></el-option>
				</el-select>
			</el-form-item>
      <el-form-item label="处理过程：" prop="img" v-loading="imgLoading">
          <el-upload 
          :limit="10" 
          action="http://175.178.101.42:8099/troubleInfo/upload"
          :on-success = "handleSuccess"
          :auto-upload= true
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          list-type="picture-card"
          v-model:file-list="fileList"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" alt="Preview Image" />
          </el-dialog>
      </el-form-item>
       
    </el-form>
  </Layer>
</template>

<script lang="ts">
import type { LayerType } from '@/components/layer/index.vue'
import type { Ref } from 'vue'
import type { ElFormItemContext } from 'element-plus/lib/el-form/src/token'
import { defineComponent, ref } from 'vue'
import { selectData, radioData } from './enum'
import Layer from '@/components/layer/index.vue'
import {DEPARTMENT_TYPE} from '@/constant/enums'
import {BASE_YES_OR_NO } from '@/constant/enums'
import {REPAIR_ERROR_TYPE } from '@/constant/enums'
import { uploadImage, addData, updateData } from '@/api/repair'
import { Plus } from '@element-plus/icons-vue'
import { v4 as uuidv4 } from 'uuid';

import type { UploadProps, UploadUserFile } from 'element-plus'
export default defineComponent({
  components: {
    Layer,
    Plus,
    addData,
    updateData
  },
  props: {
    layer: {
      type: Object,
      default: () => {
        return {
          show: false,
          title: '',
          showButton: true
        }
      }
    }
  },
  setup(props, ctx) {
    const fileList = ref<UploadUserFile[]>([]);
    const imgLoading = false;
    const dialogImageUrl = ref('')
    const dialogVisible = ref(false)
    const ruleForm: Ref<ElFormItemContext|null> = ref(null)
    const layerDom: Ref<LayerType|null> = ref(null)
    let imgMap:Map<number,string> = new Map();
    let form = ref({
      departmentType: '',
      departmentName: '',
      troubleDesc: '',
      dealProcess: '',
      type:'',
      isHard:false
    })

    const rules = {
      departmentType: [{ required: true, message: '请选择科室类型', trigger: 'blur' }],
      departmentName: [{ required: true, message: '请输入科室名', trigger: 'blur' }],
      troubleDesc: [{ required: true, message: '请输入问题描述', trigger: 'blur' }],
      type: [{ required: true, message: '请选择问题类型', trigger: 'blur' }],
      dealProcess: [{ required: true, message: '请选择问题类型', trigger: 'blur' }],

    }
    init()
    function init() { // 用于判断新增还是编辑功能
      if (props.layer.row) {
        let imgStr = props.layer.row.dealProcess
        let imgStrList = imgStr.split(',')
        imgStrList.forEach((item: string)=> {
          const id = uuidv4()
          fileList.value.push({ uid: id, name: id, url: item})
          imgMap.set(id,item)
        });
        form.value = JSON.parse(JSON.stringify(props.layer.row)) // 数量量少的直接使用这个转
      } 
    }
    
    //上传成功后处理
    const handleSuccess: UploadProps['onSuccess'] = (response:any,uploadFiles) =>{
      imgMap.set(uploadFiles.uid,response.data)
    }

    //上传卡片预览
    const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
      dialogImageUrl.value = uploadFile.url!
      dialogVisible.value = true
    }

    //删除图片
    const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
      imgMap.delete(uploadFile.uid)
    }

    return {
      departmentType:DEPARTMENT_TYPE,
      repairErrorType:REPAIR_ERROR_TYPE,
      baseYesOrNo:BASE_YES_OR_NO,
      form,
      rules,
      layerDom,
      ruleForm,
      selectData,
      radioData,
      imgLoading,
      handleSuccess,
      fileList,
      dialogImageUrl,
      dialogVisible,
      handlePictureCardPreview,
      handleRemove,
      Plus,
      imgMap
    }
  },
  methods: {
    submit() {
      if (this.ruleForm) {
        this.ruleForm.validate((valid: any) => {
          if (valid) {
            let params = this.form
            let imgStr = ''
            this.imgMap.forEach((key,value)=>{
              if(imgStr.length > 0 ){
                imgStr = imgStr + ','+key
              }
              else{
                imgStr = key;
              }
            })
            params.dealProcess = imgStr
            if (this.layer.row) {
              this.updateData(params)
            } else {
              this.addData(params)
            }
          } else {
            return false;
          }
        });
      }
    },
    // 新增提交事件
    addData(params: object) {
      addData(params)
      .then(res => {
        this.$message({
          type: 'success',
          message: '新增成功'
        })
        this.$emit('getTableData', true)
        this.layerDom && this.layerDom.close()
      })
    },
    // 编辑提交事件
    updateData(params: object) {
      updateData(params)
      .then(res => {
        this.$message({
          type: 'success',
          message: '编辑成功'
        })
        this.$emit('getTableData', false)
        this.layerDom && this.layerDom.close()
      })
    }
  }
})
</script>

<style lang="scss" scoped>
  
</style>