<template>
    <v-layout align-center="true">
        <v-menu offset-y min-width="180" style="margin-right: 130px">
            <template v-slot:activator="{ on }">
                <v-btn class="ml-4" color="primary" v-on="on" :depressed="true">
                    프로필
                </v-btn>
            </template>
            <v-list dense>
                <v-list-item @click="activeFolderDialog" v-if="!fullPath.startsWith('/scene')">
                    <v-list-item-action>
                        <v-icon>folder</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title class="body-1">폴더</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-menu>
        <v-spacer></v-spacer>
        <v-btn text icon large :color="drawerRight?'blue':'grey'" class="mr-3" v-if="fullPath.startsWith('/question')" @click="setDrawerRight(!drawerRight)">
            <v-icon>info</v-icon>
        </v-btn>
        <v-dialog v-model="create_folder_dialog" persistent max-width="340">
<!--            <v-card>-->
<!--                <v-card-title class="headline">새 폴더</v-card-title>-->
<!--                <v-card-text>-->
<!--                    <v-text-field-->
<!--                            label="폴더명"-->
<!--                            v-model="create_folder_dialog_title"-->
<!--                    ></v-text-field>-->
<!--                </v-card-text>-->
<!--                <v-card-actions>-->
<!--                    <v-spacer></v-spacer>-->
<!--                    <v-btn text @click.native="create_folder_dialog = false">취소</v-btn>-->
<!--                    <v-btn color="primary" v-if="fullPath.startsWith('/question')"-->
<!--                           @click.native="_createQuestionFolder"-->
<!--                           :dark="create_folder_dialog_title!==''"-->
<!--                           :disabled="create_folder_dialog_title===''">만들기-->
<!--                    </v-btn>-->
<!--                    <v-btn color="primary" v-else-if="fullPath.startsWith('/report')"-->
<!--                           @click.native="_createReportFolder"-->
<!--                           :dark="create_folder_dialog_title!==''"-->
<!--                           :disabled="create_folder_dialog_title===''">만들기-->
<!--                    </v-btn>-->
<!--                </v-card-actions>-->
<!--            </v-card>-->
        </v-dialog>
    </v-layout>
</template>

<script>
    import {mapActions} from 'vuex'
    import axios from 'axios'

    export default {
        components: {
        },
        data () {
            return {
                fullPath: '',
                create_folder_dialog: false,
                create_folder_dialog_title: '',
                create_paper_folder_dialog: false,
                create_paper_folder_dialog_title: '',
                create_paper_folder_dialog_keyword: '',
                create_paper_folder_dialog_file: {
                    name: '',
                    file: null
                },
                create_report_dialog: false,
                papers: null,
                selectedPaperId: null
            }
        },
        computed: {
            user () {
                return this.$store.state.user
            },
            // directories () {
            //     return this.$store.state.directories
            // },
            drawerRight () {
                return this.$store.state.drawerRight
            }
        },
        watch: {
            $route: function (_route) {
                this.fullPath = _route.fullPath
            }
        },
        methods: {
            activeFolderDialog: function () {
                if (this.fullPath.startsWith('/paper')) {
                    this.create_paper_folder_dialog = true
                } else {
                    this.create_folder_dialog = true
                }
            },
            _createPaperFolder: async function () {
                var this_folder_id = this.$route.params.id ? this.$route.params.id : 0
                await this.createPaperFolder({
                    query: [`parent_id: ${this_folder_id}`, `email: "${this.user.email}"`, `title: "${this.create_paper_folder_dialog_title}"`, `keyword: "${this.create_paper_folder_dialog_keyword}"`],
                    thumbnail: this.create_paper_folder_dialog_file
                })
                this.getPaperFolder([`folder_id: ${this_folder_id}`])
                this.getPaperFolders([`email: "${this.user.email}"`, `folder_id: ${this_folder_id}`])
                this.getPapers([`email: "${this.user.email}"`, `folder_id: ${this_folder_id}`])
                this.create_paper_folder_dialog = false
                this.create_paper_folder_dialog_title = ''
                this.create_paper_folder_dialog_keyword = ''
                this.create_paper_folder_dialog_file = {
                    name: '',
                    file: null
                }
            },
            _createCognitive: async function () {
                let {data} = await axios.post(this.$api_url, {
                    query: `{
            create_cognitive_test(user_id:${this.user.id}) {
              id
            }
          }`
                })
                if (data.data.create_cognitive_test) {
                    this.$router.push({path: `/cognitive/scene/${data.data.create_cognitive_test.id}`})
                }
            },
            _getPapers: async function () {
                let {data} = await axios.post(this.$api_url, {
                    query: `{
  papers(email:"${this.user.email}", folder_id:-1) {
    id email title keyword thumbnail date_created
    user {
        id email full_name profile {
            picture
        }
    }
  }
}`
                })
                this.papers = data.data.papers
                this.create_report_dialog = true
            },
            ...mapActions({
                setDrawerRight: 'setDrawerRight'
            })
        },
        mounted: function () {
            this.fullPath = this.$route.fullPath
        }
    }
</script>
