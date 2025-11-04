export const DEPARTMENT_TYPE = ({
                INPATIENT:{code:0, desc:"住院"},
                OUTPATIENT:{code:1, desc:"门诊"},
                MEDICAL_TECHNOLOGY:{code:2, desc:"医技"},
                PHYSICAL_EXAM:{code:3, desc:"体检"},
                OTHER:{code:4, desc:"其他"}
      })
export const BASE_YES_OR_NO = ({
                YES:{code:true,desc:'是'},
                NO:{code:false,desc:'否'}
      })
export const REPAIR_ERROR_TYPE = ({
                HARDWARE:{code:0, desc:"硬件"},
                NETWORK:{code:1, desc:"网络"},
                HIS:{code:2, desc:"HIS"},
                EMR:{code:3, desc:"EMR"},
                PLATFORM:{code:4, desc:"平台"},
                OTHER:{code:5, desc:"其他"}
      })