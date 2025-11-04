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
			<el-form-item label="是否疑难：" prop="select">
			  <el-select v-model="form.isHard" placeholder="请选择是否" clearable>
					<el-option v-for="item in baseYesOrNo"  :key="item.code" :label="item.desc" :value="item.code"></el-option>
				</el-select>
			</el-form-item>
       
    </el-form>
  </Layer>
</template>

<script lang="ts">
import type { LayerType } from '@/components/layer/index.vue'
import type { Ref } from 'vue'
import type { ElFormItemContext } from 'element-plus/lib/el-form/src/token'
import { defineComponent, ref } from 'vue'
import { add, update } from '@/api/table'
import { selectData, radioData } from './enum'
import Layer from '@/components/layer/index.vue'
import {DEPARTMENT_TYPE} from '@/constant/enums'
import {BASE_YES_OR_NO } from '@/constant/enums'
import {REPAIR_ERROR_TYPE } from '@/constant/enums'
export default defineComponent({
  components: {
    Layer
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
    const ruleForm: Ref<ElFormItemContext|null> = ref(null)
    const layerDom: Ref<LayerType|null> = ref(null)
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
        form.value = JSON.parse(JSON.stringify(props.layer.row)) // 数量量少的直接使用这个转
      } else {

      }
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
      radioData
    }
  },
  methods: {
    submit() {
      if (this.ruleForm) {
        this.ruleForm.validate((valid: any) => {
          if (valid) {
            let params = this.form
            if (this.layer.row) {
              this.updateForm(params)
            } else {
              this.addForm(params)
            }
          } else {
            return false;
          }
        });
      }
    },
    // 新增提交事件
    addForm(params: object) {
      add(params)
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
    updateForm(params: object) {
      update(params)
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