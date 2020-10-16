<template>
  <v-dialog v-model="is_visible" max-width="500px" @click:outside="toggle">
    <v-card>
      <v-card-title class="bg-secondary">
        <span class="ml-2">{{curr_user ? 'Edit' : 'Create'}} User</span>
        <div class="flex-grow-1"></div>
        <v-icon @click.stop="toggle">xi-close</v-icon>
      </v-card-title>
      <v-card-text class="pt-5">
        <v-form>
          <v-text-field type="text" v-model="editing_user.name" label="Name" :rules="[rules.required, rules.counter]"/>
          <v-text-field type="email" v-model="editing_user.email" label="Email"
                        :disabled="!!curr_user" :rules="[rules.required, rules.email]"/>
          <v-select :items="roles" v-model="editing_user.role" label="Role"/>
          <v-text-field type="text" v-model="editing_user.phone" label="Phone Number" />
          <v-textarea v-model="editing_user.etc" label="Info"></v-textarea>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="primary" @click.stop="saveUser">
              Save
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
  export default {
    props: ['curr_user', 'is_visible', 'toggle', 'callback'],
    data () {
      return {
        roles: [
          { text: 'Manager', value: 1 },
          { text: 'Experimenter', value: 2 },
          { text: 'Subject', value: 3 }
        ],
        rules: {
          required: value => !!value || 'Required.',
          counter: value => value.length <= 50 || 'Max 50 characters',
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          }
        },
        editing_user: {
          name: '',
          email: '',
          role: 3,
          phone: '',
          etc: ''
        }
      }
    },
    watch: {
      curr_user: function (_new) {
        if (_new) {
          this.editing_user = JSON.parse(JSON.stringify(_new))
        } else {
          this.editing_user = {
            name: '',
            email: '',
            role: ''
          }
        }
      }
    },
    methods: {
      saveUser: function () {
        alert(`save ${this.editing_user.name}`)
        this.callback()
        this.toggle()
      }
    },
    mounted () {
      if (this.curr_user) {
        this.editing_user = JSON.parse(JSON.stringify(this.curr_user))
      }
    }
  }
</script>
<style lang="scss" scoped>
  .bg-secondary {
    background: #f1f1fc;
  }

  .v-text-field {
    padding-top: 0;
  }

  .col {
    padding-bottom: 0;
  }

  .text-lg-bold {
    font-size: 1.1rem;
    font-weight: bold;
  }
</style>
<style lang="scss">
  .v-input--selection-controls:not(.v-input--hide-details) .v-input__slot {
    margin-bottom: 0 !important;
  }

  .font-small {
    .v-input--radio-curr_user__input {
      label {
        font-size: 14px;
      }
    }
  }
</style>
