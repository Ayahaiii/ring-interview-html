import Vue from 'vue'
import Router from 'vue-router'
import Constant from '../utils/limit'
import Layout from '@/components/layout'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/',
  routes: [
    // {
    //   path: '/',
    //   name: 'Index',
    //   component: () => import( /* webpackChunkName: Index */ '@/components/index/index')
    // },{
    //   path: '/index',
    //   name: 'Index',
    //   component: () => import( /* webpackChunkName: Index */ '@/components/index/index')
    // },
    // {
    //   path: '/case',
    //   name: 'Case',
    //   component: () => import( /* webpackChunkName: Index */ '@/components/index/case')
    // },
    // {
    //   path: '/pricing',
    //   name: 'Pricing',
    //   component: () => import( /* webpackChunkName: Index */ '@/components/index/pricing')
    // },
    {
      path: '/',
      redirect: '/index',
      component: Layout,
      children: [
        {
          path: '/index',
          name: 'Index',
          component: () => import( /* webpackChunkName: Index */ '@/components/index/index')
        },
        {
          path: '/case',
          name: 'Case',
          component: () => import( /* webpackChunkName: Index */ '@/components/index/case')
        },
        {
          path: '/pricing',
          name: 'Pricing',
          component: () => import( /* webpackChunkName: Index */ '@/components/index/pricing')
        },
        {
          path: '/pay',
          name: 'Pay',
          component: () => import( /* webpackChunkName: Index */ '@/components/index/pay')
        },
        {
          path: '/login',
          name: 'Login',
          component: () => import( /* webpackChunkName: Login */ '@/components/login')
        }, {
          path: '/register',
          name: 'Register',
          component: () => import( /* webpackChunkName: Login */ '@/components/register')
        }, {
          path: '/findPassword',
          name: 'FindPassword',
          component: () => import( /* webpackChunkName: Login */ '@/components/findPassword')
        }, {
          path: '/privacyPolicy',
          name: 'PrivacyPolicy',
          component: () => import( /* webpackChunkName: Index */ '@/components/common/privacy.vue')
        },

        // ********************************* 项目路由 *********************************

        {
          path: '/project',
          name: 'Project',
          component: () => import( /* webpackChunkName: Index */ '@/components/project/home/index'),
        },{
          path: '/project/create',
          name: 'CreateProject',
          component: () => import( /* webpackChunkName: Index */ '@/components/project/home/createProject'),
        },
        {
          path: '/interview',
          name: 'Interview',
          component: () => import( /* webpackChunkName: Interview */ '@/components/project/base/interviewNav'),
          redirect: '/project/info',
          children: [
            // 项目详情
            {
              path: '/project/info',
              name: 'ProjectInfo',
              component: () => import( /* webpackChunkName: ProjectDetail */ '@/components/project/base/projectInfo'),
              meta: {
                permissionId: Constant.RP_PROJECT_VIEW
              }
            }, {
              path: '/project/edit',
              name: 'ProjectEdit',
              component: () => import( /* webpackChunkName: ProjectDetail */ '@/components/project/base/edit'),
              meta: {
                permissionId: Constant.RP_PROJECT_EDIT
              }
            },{
              path: '/project/config',
              name: 'ProjectConfig',
              component: () => import( /* webpackChunkName: ProjectDetail */ '@/components/project/base/config'),
              meta: {
                permissionId: Constant.RP_PROJECT_CONFIG_ADMIN
              }
            },

            // ********************************* 团队路由 *********************************
            // 团队
            {
              path: '/team',
              name: 'Team',
              component: () => import( /* webpackChunkName: Team */ '@/components/project/team/index'),
              meta: {
                permissionId: Constant.RT_MEMBER_LIST
              }
            },{
              path: '/team/create',
              name: 'teamCreate',
              component: () => import( /* webpackChunkName: Team */ '@/components/project/team/create'),
              meta: {
                permissionId: Constant.RT_MEMBER_ADD
              }
            },{
              path: '/team/import',
              name: 'teamImport',
              component: () => import( /* webpackChunkName: Team */ '@/components/project/team/import'),
              meta: {
                permissionId: Constant.RT_MEMBER_ADD
              }
            },{
              path: '/team/export',
              name: 'teamExport',
              component: () => import( /* webpackChunkName: Team */ '@/components/project/team/export'),
              meta: {
                permissionId: Constant.RT_MEMBER_EXPORT
              }
            },{
              path: '/team/group',
              name: 'teamGroup',
              component: () => import( /* webpackChunkName: Team */ '@/components/project/team/group'),
              meta: {
                permissionId: Constant.RT_MEMBER_GROUP_ADMIN
              }
            },

            // ********************************* 访谈路由 *********************************
            // 访谈
            {
              path: '/talk',
              name: 'Interviewees',
              component: () => import( /* webpackChunkName: Interviewees */ '@/components/project/interview/index'),
              meta: {
                permissionId: Constant.RI_INTERVIEW_LIST
              }
            },
            {
              path: '/talk/create',
              name: 'IntervieweesCreate',
              component: () => import( /* webpackChunkName: Interviewees */ '@/components/project/interview/create'),
              meta: {
                permissionId: Constant.RI_INTERVIEW_ADD
              }
            },
            {
              path: '/talk/export',
              name: 'IntervieweesExport',
              component: () => import( /* webpackChunkName: Interviewees */ '@/components/project/interview/export'),
              meta: {
                permissionId: Constant.RI_INTERVIEW_EXPORT
              }
            },
            {
              path: '/talk/info',
              name: 'IntervieweesInfo',
              component: () => import( /* webpackChunkName: Interviewees */ '@/components/project/interview/info'),
              meta: {
                permissionId: Constant.RI_INTERVIEW_VIEW
              }
            },
            {
              path: '/talk/text',
              name: 'IntervieweesNav',
              redirect: '/talk/text/info',
              component: () => import( /* webpackChunkName: Interviewees */ '@/components/project/interview/itwtNav'),
              children: [
                {
                  path: '/talk/text/info',
                  name: 'IntervieweesInfo',
                  component: () => import( /* webpackChunkName: Interviewees */ '@/components/project/interview/itwtInfo'),
                  meta: {
                    permissionId: Constant.RI_INTERVIEW_TEXT_VIEW
                  }
                },
                {
                  path: '/talk/text/edit',
                  name: 'IntervieweesEdit',
                  component: () => import( /* webpackChunkName: Interviewees */ '@/components/project/interview/itwtEdit'),
                  meta: {
                    permissionId: Constant.RI_INTERVIEW_TEXT_ADD
                  }
                },
                {
                  path: '/talk/text/audit',
                  name: 'IntervieweesAudit',
                  component: () => import( /* webpackChunkName: Interviewees */ '@/components/project/interview/itwtAudit'),
                  meta: {
                    permissionId: Constant.RI_INTERVIEW_TEXT_AUDIT
                  }
                },

                {
                  path: '/talk/text/altext',
                  name: 'IntervieweesAltext',
                  component: () => import( /* webpackChunkName: Interviewees */ '@/components/project/interview/altext'),
                  meta: {
                    permissionId: Constant.RI_INTERVIEW_TEXT_ADD
                  }
                },
              ]
            },
            {
              path: '/talk/text/import',
              name: 'IntervieweesImport',
              component: () => import( /* webpackChunkName: Interviewees */ '@/components/project/interview/itwtImport'),
              meta: {
                permissionId: Constant.RI_INTERVIEW_TEXT_ADD
              }
            },
            
            {
              path: '/talk/text/export',
              name: 'IntervieweesDialogueExport',
              component: () => import( /* webpackChunkName: Interviewees */ '@/components/project/interview/itwtExport'),
              meta: {
                permissionId: Constant.RI_INTERVIEW_TEXT_EXPORT
              }
            },
            {
              path: '/talk/annex',
              name: 'IntervieweesAnnex',
              component: () => import( /* webpackChunkName: Interviewees */ '@/components/project/interview/annex'),
              meta: {
                permissionId: Constant.RI_INTERVIEW_FILE_VIEW
              }
            },{
              path: '/talk/speaker',
              name: 'IntervieweesSpeaker',
              component: () => import( /* webpackChunkName: Interviewees */ '@/components/project/interview/speaker'),
              meta: {
                permissionId: Constant.RI_INTERVIEW_TEXT_ADD
              }
            },{
              path: '/talk/speaker/create',
              name: 'IntervieweesSpeakerCreate',
              component: () => import( /* webpackChunkName: Interviewees */ '@/components/project/interview/speakerCreate'),
              meta: {
                permissionId: Constant.RI_INTERVIEW_TEXT_ADD
              }
            },
            {
              path: '/talk/voice',
              name: 'IntervieweesVoice',
              component: () => import( /* webpackChunkName: Interviewees */ '@/components/project/interview/voice'),
              meta: {
                permissionId: Constant.RI_INTERVIEW_VOICE_VIEW
              }
            },


            // ********************************* 分析路由 *********************************
            // 质性分析
            {
              path: '/analysis',
              name: 'Analysis',
              redirect: '/analysis/index',
              component: () => import( /* webpackChunkName: Analysis */ '@/components/project/analysis/analyzeNav'),
              children: [
                {
                  path: '/analysis/index',
                  name: 'AnalysisIndex',
                  component: () => import( /* webpackChunkName: Analysis */ '@/components/project/analysis/index'),
                  meta: {
                    permissionId: Constant.RA_STAT_LIST
                  }
                },
                {
                  path: '/analysis/text',
                  name: 'AnalysisText',
                  component: () => import( /* webpackChunkName: Analysis */ '@/components/project/analysis/text'),
                  meta: {
                    permissionId: Constant.RA_STAT_LIST
                  }
                },
                {
                  path: '/analysis/code',
                  name: 'AnalysisCode',
                  component: () => import( /* webpackChunkName: Analysis */ '@/components/project/analysis/code'),
                  meta: {
                    permissionId: Constant.RA_STAT_LIST
                  }
                },
                {
                  path: '/analysis/graph',
                  name: 'AnalysisGraph',
                  component: () => import( /* webpackChunkName: Analysis */ '@/components/project/analysis/graph'),
                  meta: {
                    permissionId: Constant.RA_STAT_LIST
                  }
                },
                {
                  path: '/analysis/mark',
                  name: 'AnalysisMark',
                  component: () => import( /* webpackChunkName: Analysis */ '@/components/project/analysis/mark'),
                  meta: {
                    permissionId: Constant.RA_STAT_LIST
                  }
                },
                {
                  path: '/analysis/stat',
                  name: 'AnalysisStatistics',
                  component: () => import( /* webpackChunkName: Analysis */ '@/components/project/analysis/statistics'),
                  meta: {
                    permissionId: Constant.RA_STAT_LIST
                  }
                },
              ]
            },


            // ********************************* 样本路由 *********************************
            // 访谈对象
            {
              path: '/sample',
              name: 'Sample',
              component: () => import( /* webpackChunkName: Target */ '@/components/project/sample/index'),
              meta: {
                permissionId: Constant.RS_SAMPLE_LIST
              }
            },
            // 创建
            {
              path: '/sample/info',
              name: 'SampleInfo',
              component: () => import( /* webpackChunkName: Target */ '@/components/project/sample/info'),
              meta: {
                permissionId: Constant.RS_SAMPLE_ADD
              }
            },
            // 分派
            {
              path: '/sample/assign',
              name: 'SampleAssign',
              component: () => import( /* webpackChunkName: Target */ '@/components/project/sample/assign'),
              meta: {
                permissionId: Constant.RS_SAMPLE_ASSIGN_ADMIN
              }
            },
            // 批量分派
            {
              path: '/sample/batch/assign',
              name: 'SampleBatchAssign',
              component: () => import( /* webpackChunkName: Target */ '@/components/project/sample/batchAssign'),
              // meta: {
              //   permissionId: Constant.RS_SAMPLE_ASSIGN_ADMIN
              // }
            },
            // 导出
            {
              path: '/sample/export',
              name: 'SampleExport',
              component: () => import( /* webpackChunkName: Target */ '@/components/project/sample/export'),
              meta: {
                permissionId: Constant.RS_SAMPLE_EXPORT
              }
            },
            // 批量上传分派
            {
              path: '/sample/assign/import',
              name: 'SampleAssignImport',
              component: () => import( /* webpackChunkName: Target */ '@/components/project/sample/assignImport'),
              meta: {
                permissionId: Constant.RS_SAMPLE_ASSIGN_ADMIN
              }
            },
            // 批量导出
            {
              path: '/sample/import',
              name: 'SampleImport',
              component: () => import( /* webpackChunkName: Target */ '@/components/project/sample/import'),
              meta: {
                permissionId: Constant.RS_SAMPLE_EXPORT
              }
            },
            // 属性管理
            {
              path: '/sample/property',
              name: 'SampleProperty',
              component: () => import( /* webpackChunkName: Target */ '@/components/project/sample/property'),
              meta: {
                permissionId: Constant.RS_SAMPLE_PROPERTY_ADMIN
              }
            },

            // ********************************* 样本路由 *********************************
            //监控报表
            {
              path: '/report',
              name: 'Report',
              component: () => import( /* webpackChunkName: Target */ '@/components/project/report/index'),
              meta: {
                permissionId: Constant.RM_MONITOR_LIST
              }
            },
            {
              path: '/report/gantt',
              name: 'ReportGantt',
              component: () => import( /* webpackChunkName: Target */ '@/components/project/report/gantt'),
              meta: {
                permissionId: Constant.RM_MONITOR_LIST
              }
            }
          ]
        },

      ]
    }, {
      path: '/unauthorized',
      name: 'Error',
      component: () => import( /* webpackChunkName: Error */ '@/components/401')
    }, {
      path: '/stop',
      name: 'Error',
      component: () => import( /* webpackChunkName: Error */ '@/components/500')
    }
  ]
})
