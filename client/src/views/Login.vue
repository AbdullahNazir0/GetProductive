<script setup>
import { ref } from 'vue'
import api from '../utils/axios.js'
import { InputText, Message, Password, Button } from 'primevue'
import { Form, FormField } from '@primevue/forms'
import { useToast } from 'vue-toast-notification'

const toast = useToast()
const isLoading = ref(false)

const formValues = ref({
  email: '',
  password: '',
})

const validateEmail = (value) => /\S+@\S+\.\S+/.test(value) || 'Invalid email address'

const validatePassword = (value) => {
  if (!value) return 'Password is required'
  return true
}

const onFormSubmit = async () => {
  if(isLoading.value) return

  const { email, password } = formValues.value

  if (!email || !password) {
    toast.error('All fields are required')
    return
  }

  if (validatePassword(password) !== true) {
    toast.error(validatePassword(password))
    return
  }

  if (validateEmail(email) !== true) {
    toast.error(validateEmail(email))
    return
  }

  isLoading.value = true
  try {
    await api.post('/users/login', { email, password })
    toast.success('Login successful!')
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
      <h2 class="text-2xl font-semibold mb-4 text-center">Login</h2>
      <Form @submit="onFormSubmit" class="flex flex-col gap-4">
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

        <Button :loading="isLoading" type="submit" severity="primary" label="Login" class="w-full" />
        <div class="w-full text-center"> Don&nbsp;t have an account? <router-link to="/auth/register">Register</router-link></div>
      </Form>
    </div>
  </div>
</template>
