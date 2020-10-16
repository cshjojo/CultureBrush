<template>
<!--    <v-app v-if="user && user.is_admin">-->
    <v-app class="theme--dark">
        <v-container>
            <v-row>
                <v-dialog v-model="is_active_edit_user_modal" width="500">
                    <template v-slot:activator="{ on, attrs}">
                        <v-btn dark color="primary" @click.stop="_createUser">
                            사용자 추가
                        </v-btn>
                    </template>
                    <v-card>
                        <v-card-title class="headline">
                            사용자 {{curr_user ? '편집' : '추가'}}
                            <v-spacer></v-spacer>
                            <v-icon @click.stop="is_active_edit_user_modal=false">mdi-close</v-icon>
                        </v-card-title>
                        <v-card-text>
                            <v-form>
                                <v-text-field v-model="name" label="이름"></v-text-field>
                                <v-text-field v-model="email" label="이메일"></v-text-field>
                                <v-switch v-model="is_admin" class="ma-2" label="관리자여부"></v-switch>
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn dark color="pink darken-2" @click.stop="saveUser">
                                저장
                            </v-btn>
                            <v-btn @click.stop="is_active_edit_user_modal = false">
                                닫기
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
            <v-row>
                <v-simple-table align="center" style="margin-left:auto; margin-right:auto; width:70%;" class="table theme--dark">
                    <template v-slot:default>
                        <thead>
                        <tr>
                            <th>이름</th>
                            <th>이메일</th>
                            <th>관리자</th>
                            <th>기능</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="_user in users" :key="_user.id" class="rows">
                            <td>{{_user.name}}</td>
                            <td>{{_user.email}}</td>
                            <td>{{_user.is_admin ? 'O' : 'X'}}</td>
                            <td>
                                <template v-if="!_user.is_superuser">
                                    <v-btn rounded @click.stop="_updateUser(_user)">
                                        <v-icon>mdi-pencil</v-icon> 수정하기
                                    </v-btn>
                                    <v-btn rounded color="error" @click.stop="_deleteUser(_user)">
                                        <v-icon>mdi-delete</v-icon> 삭제하기
                                    </v-btn>
                                </template>
                            </td>
                        </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-row>
            <v-flex text-md-center class="pt-3">
                <v-progress-circular indeterminate color="primary" v-if="is_loading"></v-progress-circular>
            </v-flex>
        </v-container>
    </v-app>
</template>

<script>
    import {mapActions} from 'vuex'
    import axios from 'axios'

    export default {
        data() {
            return {
                users: false,
                curr_user: null,
                is_loading: false,
                is_active_edit_user_modal: false,
                name: '',
                email: '',
                is_admin: false
            }
        },
        computed: {
            user() {
                return this.$store.state.user
            }
        },
        watch: {
            curr_user: function (_new) {
                if (_new) {
                    this.name = _new.name
                    this.email = _new.email
                    this.is_admin = !!_new.is_admin
                } else {
                    this.name = ''
                    this.email = ''
                    this.is_admin = false
                }
            }
        },
        methods: {
            _createUser: function () {
                this.curr_user = null
                this.is_active_edit_user_modal = true
            },
            _updateUser: function (_user) {
                this.curr_user = _user
                this.is_active_edit_user_modal = true
            },
            saveUser: async function () {
                let isSucceed = false
                if (this.curr_user) {
                    isSucceed = await this.updateUser([`id: ${this.curr_user.id}, name:"${this.name}", email: "${this.email}",
                      is_admin:${this.is_admin}`])
                } else {
                    isSucceed = await this.createUser([`name:"${this.name}", email: "${this.email}", is_admin:${this.is_admin}`])
                }
                if (isSucceed) {
                  this.users = await this.getUsers()
                  this.curr_user = null
                  this.is_active_edit_user_modal = false
                } else {
                    alert('오류가 발생했습니다. 입력하신 내용을 확인해주세요.')
                }
            },
            _deleteUser: async function (_user) {
                if (!confirm('정말로 삭제하시겠습니까?\n이 기능은 되돌릴 수 없습니다.')) return false
                if(await this.deleteUser([`id:${_user.id}`])){
                    await this.getUsers()
                } else {
                    alert('오류가 발생했습니다.')
                }
            },
            ...mapActions({
              getUsers: 'getUsers',
              createUser: 'createUser',
              updateUser: 'updateUser',
              deleteUser: 'deleteUser'
            })
        },
        mounted: async function () {
          if(!this.user || !this.user.is_admin)return this.$router.push({path: `/`});
          this.users = await this.getUsers()
        }
    }
</script>

<style>
    .rows {
        cursor: pointer;
    }
</style>
