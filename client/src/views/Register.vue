<script setup>
import { ref } from 'vue'
import api from '../utils/axios.js'
import { InputText, Message, Password, Button } from 'primevue'
import { Form, FormField } from '@primevue/forms'
import { useToast } from 'vue-toast-notification'

const toast = useToast()
const isLoading = ref(false)

const formValues = ref({
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const validateEmail = (value) => /\S+@\S+\.\S+/.test(value) || 'Invalid email address'

const validatePassword = (value) => {
  if (!value) return 'Password is required'
  if (value.length < 8) return 'Password must be at least 8 characters long'
  return true
}

const validatePasswordMatch = (value) =>
  value === formValues.value.password || 'Passwords do not match'

const onFormSubmit = async () => {
  if(isLoading.value) return

  const { firstname, lastname, email, password, confirmPassword } = formValues.value

  if (!firstname || !lastname || !email || !password || !confirmPassword) {
    toast.error('All fields are required')
    return
  }

  if (validatePassword(password) !== true) {
    toast.error(validatePassword(password))
    return
  }

  if (validatePasswordMatch(confirmPassword) !== true) {
    toast.error(validatePasswordMatch(confirmPassword))
    return
  }

  if (validateEmail(email) !== true) {
    toast.error(validateEmail(email))
    return
  }

  isLoading.value = true
  try {
    await api.post('/users/register', { firstName: firstname, lastName: lastname, email, password })
    toast.success('Registration successful!')
    router.push({ name: 'Login' })
  } catch (error) {
    toast.error(error?.response?.data?.message || 'An unknown error occurred')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex justify-center items-center min-h-screen">
    <div class="p-6 rounded-xl border shadow-md w-full max-w-md">
      <h2 class="text-2xl font-semibold mb-4 text-center">Register</h2>
      <Form @submit="onFormSubmit" class="flex flex-col gap-4">
        <FormField v-slot="$field" name="firstname" class="flex flex-col gap-1">
          <label class="font-medium">First Name</label>
          <InputText v-model="formValues.firstname" type="text" placeholder="Enter your first name" />
          <Message v-if="$field.invalid" severity="error" size="small">{{ $field.error?.message }}</Message>
        </FormField>

        <FormField v-slot="$field" name="lastname" class="flex flex-col gap-1">
          <label class="font-medium">Last Name</label>
          <InputText v-model="formValues.lastname" type="text" placeholder="Enter your last name" />
          <Message v-if="$field.invalid" severity="error" size="small">{{ $field.error?.message }}</Message>
        </FormField>

        <FormField v-slot="$field" name="email" :resolver="validateEmail" class="flex flex-col gap-1">
          <label class="font-medium">Email</label>
          <InputText v-model="formValues.email" type="email" placeholder="Enter your email" />
          <Message v-if="$field.invalid" severity="error" size="small">{{ $field.error?.message }}</Message>
        </FormField>

        <FormField v-slot="$field" name="password" :resolver="validatePassword" class="flex flex-col gap-1">
          <label class="font-medium">Password</label>
          <Password v-model="formValues.password" placeholder="Enter your password" :feedback="false" toggleMask fluid />
          <Message v-if="$field.invalid" severity="error" size="small">{{ $field.error?.message }}</Message>
        </FormField>

        <FormField v-slot="$field" name="confirmPassword" :resolver="validatePasswordMatch" class="flex flex-col gap-1">
          <label class="font-medium">Confirm Password</label>
          <Password v-model="formValues.confirmPassword" placeholder="Confirm your password" :feedback="false" toggleMask fluid />
          <Message v-if="$field.invalid" severity="error" size="small">{{ $field.error?.message }}</Message>
        </FormField>

        <Button :loading="isLoading" type="submit" severity="primary" label="Register" class="w-full" />
        <div class="w-full text-center"> Already have an account? <router-link to="/auth/login">Login</router-link></div>
      </Form>
    </div>
  </div>
</template>
