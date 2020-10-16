<template>
  <v-app>
    <v-app-bar app clipped-left max-height="64" color="secondary">
      <div class="flex-grow-1"></div>
      <v-toolbar-title>
        Users
      </v-toolbar-title>
      <div class="flex-grow-1"></div>
      <div>
        <v-btn small fab color="primary" @click.stop="createUser" title="사용자 생성">
          <v-icon>xi-plus</v-icon>
        </v-btn>
      </div>
    </v-app-bar>
    <drawer-manager/>
    <v-content>
      <v-row align-xl="center" align-lg="center" align-md="center" align-sm="center">
        <v-col v-if="users.left" md="7">
          <h3>Users</h3>
          <v-select v-model="curr_group.left" :items="groups.left" label="Group"></v-select>
          <v-simple-table>
            <thead>
            <tr>
              <th>#</th><th>Name(Email)</th><th>Role</th><th>Generated Date</th><th>Function</th>
            </tr>
            </thead>
            <tbody v-if="users.left.length > 0">
            <tr v-for="(_user, idx) in users.left" :key="_user.id">
              <td>{{idx + 1}}</td>
              <td>{{_user.name}}({{_user.email}})</td>
              <td>{{role_str[_user.role]}}</td>
              <td>{{new Date(_user.date_created).toLocaleString()}}</td>
              <td>
                <v-btn text @click.stop="addGroupUser(_user.id)">
                  <v-icon title="그룹에 추가" size="15">mdi-account-multiple-plus-outline</v-icon>Add
                </v-btn>
                <v-btn text @click.stop="editUser(_user)">
                  <v-icon title="수정" size="15">mdi-pencil</v-icon>Edit
                </v-btn>
                <v-btn text @click.stop="deleteUser(_user.id)">
                  <v-icon title="삭제" size="15">xi-trash</v-icon>Delete
                </v-btn>
              </td>
            </tr>
            </tbody>
            <tbody v-else>
            <tr>
              <td align="center" colspan="5">There are no users.</td>
            </tr>
            </tbody>
          </v-simple-table>
        </v-col>
        <v-col v-if="users.right" md="5">
          <h3>Group users</h3>
          <v-select v-model="curr_group.right" :items="groups.right" label="Group"></v-select>
          <v-simple-table>
            <thead>
            <tr>
              <th>#</th><th>Name(Email)</th><th>Function</th>
            </tr>
            </thead>
            <tbody v-if="users.right.length > 0">
            <tr v-for="(_user, idx) in users.right" :key="_user.id">
              <td>{{idx + 1}}</td>
              <td>{{_user.name}}({{_user.email}})</td>
              <td>
                <v-btn text @click.stop="removeGroupUser(_user.id)">
                  <v-icon title="삭제" size="15">mdi-account-multiple-minus-outline</v-icon>Remove
                </v-btn>
              </td>
            </tr>
            </tbody>
            <tbody v-else>
            <tr>
              <td align="center" colspan="3">There are no users.</td>
            </tr>
            </tbody>
          </v-simple-table>
        </v-col>
        <div v-else class="loading"></div>
      </v-row>
    </v-content>
    <edit-user-modal :is_visible="is_active_edit_user_modal" :toggle="toggleEditUserModal"
                      :callback="callbackEditUserModal" :curr_user="curr_user"></edit-user-modal>
  </v-app>
</template>

<script>
  import { mapActions } from 'vuex'
  import axios from 'axios'

  export default {
    components: {
      'edit-user-modal': require('@/components/user/editUserModal.vue').default
    },
    data () {
      return {
        role_str: {
          1: 'Manager',
          2: 'Experimenter',
          3: 'Subject'
        },
        is_active_edit_user_modal: false,
        users: {
          left: null,
          right: null
        },
        curr_user: null,
        groups: {
          left: [
            { text: 'ALL', value: -1 },
            { text: 'Group 1', value: 1 },
            { text: 'Group 2', value: 2 }
          ],
          right: [
            { text: 'ALL', value: -1 },
            { text: 'Group 1', value: 1 },
            { text: 'Group 2', value: 2 }
          ]
        },
        curr_group: {
          left: -1,
          right: -1
        }
      }
    },
    computed: {
      user () { return this.$store.state.user },
      tests () { return this.$store.state.tests },
    },
    watch: {
      'curr_group.left': async function (_new) {
        this.users.left = await this.getUsers(_new)
      },
      'curr_group.right': async function (_new) {
        this.users.right = await this.getUsers(_new)
      }
    },
    methods: {
      linkUrl: function (url) {
        this.$router.push({path: url})
      },
      createUser: async function () {
        this.curr_user = null
        this.toggleEditUserModal()
      },
      deleteUser: async function (_id) {
        if (!confirm('Are you sure you want to delete this user?')) return false
        alert('delete user')
      },
      editUser: function (_user) {
        this.curr_user = _user
        this.toggleEditUserModal()
      },
      addGroupUser: async function (_id) {
        alert('add user to group')
      },
      removeGroupUser: async function (_id) {
        alert('remove user from group')
      },
      getUsers: async function (groupId) {
        return [
          { id: 1, name: 'dev.01', email: 'dev.01@hints.or.kr', role: 1, date_created: Date(), phone: '010-1234-1234' },
          { id: 2, name: 'dev.02', email: 'dev.02@hints.or.kr', role: 1, date_created: Date(), phone: '010-1234-1234' }
        ]
      },
      reloadUsers: async function () {
        this.users.left = await this.getUsers(this.curr_group.left)
        this.users.right = await this.getUsers(this.curr_group.right)
      },
      toggleEditUserModal: function () {
        this.is_active_edit_user_modal = !this.is_active_edit_user_modal
      },
      callbackEditUserModal: function () {
        this.curr_user = null
      },
      ...mapActions({
        setUser: 'setUser'
      })
    },
    mounted: async function () {
      await this.reloadUsers()
    }
  }
</script>
