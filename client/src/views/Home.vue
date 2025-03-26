<script setup>
  import { ref, onMounted } from 'vue'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import Dialog from 'primevue/dialog'
  import Button from 'primevue/button'
  import InputText from 'primevue/inputtext'
  import DatePicker from 'primevue/datepicker'
  import Select from 'primevue/select'
  import { Check, Pencil, Trash2 } from 'lucide-vue-next';
  import api from '../utils/axios.js'
  import { useToast } from 'vue-toast-notification'

  const isLoading = ref(false)
  const tasks = ref([])
  const task = ref({
    title: '',
    description: '',
    deadline: null,
    priority: 0,
  })
  const selectedTask = ref(null)
  const priorities = ref([
    { label: "Low", value: 0 },
    { label: "Medium", value: 1 },
    { label: "High", value: 2 }
  ]);
  const toast = useToast()

  const showAddDialog = ref(false)
  const showEditDialog = ref(false)

  onMounted(() => {
    fetchTasks()
  })

  const fetchTasks = async () => {
    if(isLoading.value) return

    isLoading.value = true
    try {
      const response = await api.get('/tasks')
      // tasks.value = response.data.data.sort((a, b) => a.isDone - b.isDone)
      tasks.value = response.data.data.sort((a, b) => {
        if (a.isDone !== b.isDone) return a.isDone - b.isDone;

        return b.priority - a.priority;
      })
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      isLoading.value = false
    }
  }

  const addTask = async () => {
    if(isLoading.value) return

    if(!task.value.title) {
      toast.error('Please fill all fields')
      return
    }
    isLoading.value = true
    try {
      await api.post('/tasks', task.value)
      toast.success('Task added successfully')
      isLoading.value = false
      toggleAddDialog()
      resetTask()
      fetchTasks()
    } catch (error) {
      console.log(error)
      toast.error('Something went wrong')
    } finally {
      isLoading.value = false
    }
  }

  const toggleAddDialog = () => {
    showAddDialog.value = !showAddDialog.value
  }

  const resetTask = () => {
    task.value = { title: '', description: '', deadline: null, priority: 0 };
  };

  const toggleTaskIsDone = async (task) => {
    if(isLoading.value) return

    isLoading.value = true
    try {
      await api.put(`/tasks/${task._id}`, { ...task, isDone: !task.isDone })
      toast.success(task.isDone ? 'Task marked as incomplete' : 'Task marked as complete');
      isLoading.value = false
      fetchTasks()
    } catch (error) {
      console.log(error)
      toast.error('Something went wrong')
      isLoading.value = false
    }
  }

  const editTask = async () => {
    if(isLoading.value || selectedTask.value === null) return

    if(!selectedTask.value.title) {
      toast.error('Please fill all fields')
      return
    }
    isLoading.value = true
    try {
      await api.put(`/tasks/${selectedTask.value._id}`, selectedTask.value)
      toast.success('Task updated')
      isLoading.value = false
      toggleEditDialog()
      fetchTasks()
    } catch (error) {
      console.log(error)
      toast.error('Something went wrong')
      isLoading.value = false
    }
  }

  const toggleEditDialog = () => {
    if(showEditDialog.value) {
      selectedTask.value = null
    }
    showEditDialog.value = !showEditDialog.value
  }

  const deleteTask = async (taskId) => {
    if(isLoading.value) return

    isLoading.value = true
    try {
      await api.delete(`/tasks/${taskId}`)
      toast.success('Task deleted')
      isLoading.value = false
      fetchTasks()
    } catch (error) {
      console.log(error)
      toast.error('Something went wrong')
      isLoading.value = false
    }
  }
</script>

<template>
    <div class="h-[20vh] flex justify-between items-center px-10">
        <h1 class="text-4xl font-bold text-primary">Today&apos;s Tasks</h1>
        <h4 class="text-xl font-semibold text-gray-600">{{ new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</h4>
        <Button @click="toggleAddDialog" label="Add Task" variant="text" size="large" raised />
    </div>
    <!-- <div v-if="tasks.length === 0" class="h-[70vh] flex justify-center items-center">
        <h2 class="text-gray-500 text-lg text-center">No Tasks Found</h2>
    </div> -->
    <DataTable :value="tasks"
        emptyMessage="No Tasks Found"
        :loading="isLoading"
        tableStyle="min-width: 50rem; height: auto; max-height: 70vh"
    >
        <Column header="Title" field="title">
            <template #body="{ data }">
                <span :class="{ 'line-through text-gray-500': data.isDone }">
                    {{ data.title }}
                </span>
            </template>
        </Column>
        <Column header="Description" field="description">
            <template #body="{ data }">
                <span :class="{ 'line-through text-gray-500': data.isDone }">
                    {{ data.description }}
                </span>
            </template>
        </Column>
        <Column header="Deadline" field="deadline">
            <template #body="{ data }">
                <span :class="{ 'line-through text-gray-500': data.isDone }">
                    {{ data.deadline ? new Date(data.deadline).toLocaleDateString('en-GB') : 'N/A' }}
                </span>
            </template>
        </Column>
        <Column header="Priority" field="priority">
            <template #body="{ data }">
                <span :class="{ 'line-through text-gray-500': data.isDone }">
                    {{ data.priority == 0 ? 'Low' : data.priority == 1 ? 'Medium' : 'High' }}
                </span>
            </template>
        </Column>

        <Column header="Actions">
            <template #body="{ data }">
                <Button class="p-button-rounded p-button-success p-mr-2" @click="toggleTaskIsDone(data)">
                    <Check size="18" stroke-width="2"/>
                </Button>
                <Button class="p-button-rounded p-button-warning p-mr-2" @click="() => { selectedTask = { ...data }; toggleEditDialog() }">
                    <Pencil size="18" stroke-width="2"/>
                </Button>
                <Button class="p-button-rounded p-button-danger" @click="deleteTask(data._id)">
                    <Trash2 size="18" stroke-width="2"/>
                </Button>
            </template>
        </Column>
    </DataTable>

    <!-- Add Task Dialog -->
    <Dialog v-model:visible="showAddDialog" modal header="Add Task" :style="{ width: '30rem' }">
        <span class="text-surface-500 text-center dark:text-surface-400 block mb-8">Fill in the task details.</span>

        <div class="flex items-center gap-4 mb-4">
            <label for="taskTitle" class="font-semibold w-24">Title</label>
            <InputText id="taskTitle" v-model="task.title" class="flex-auto" autocomplete="off" required />
        </div>

        <div class="flex items-center gap-4 mb-4">
            <label for="description" class="font-semibold w-24">Description</label>
            <InputText id="description" v-model="task.description" class="flex-auto" autocomplete="off" />
        </div>

        <div class="flex items-center gap-4 mb-4">
            <label for="deadline" class="font-semibold w-24">Deadline</label>
            <DatePicker id="deadline" v-model="task.deadline" class="flex-auto" dateFormat="yy-mm-dd" required showIcon />
        </div>

        <div class="flex items-center gap-4 mb-8">
            <label for="priority" class="font-semibold w-24">Priority</label>
            <Select id="priority" v-model="task.priority" :options="priorities" optionLabel="label" optionValue="value" placeholder="Select Priority" class="flex-auto" />
        </div>

        <div class="flex justify-end gap-2">
            <Button type="button" label="Cancel" severity="secondary" @click="showAddDialog = false"></Button>
            <Button :loading="isLoading" type="button" label="Save" @click="addTask"></Button>
        </div>
    </Dialog>

    <!-- Edit Task Dialog -->
    <Dialog v-model:visible="showEditDialog" modal header="Edit Task" :style="{ width: '30rem' }">
        <span class="text-surface-500 text-center dark:text-surface-400 block mb-8">Fill in the task details.</span>

        <div class="flex items-center gap-4 mb-4">
            <label for="taskTitle" class="font-semibold w-24">Title</label>
            <InputText id="taskTitle" v-model="selectedTask.title" class="flex-auto" autocomplete="off" required />
        </div>

        <div class="flex items-center gap-4 mb-4">
            <label for="description" class="font-semibold w-24">Description</label>
            <InputText id="description" v-model="selectedTask.description" class="flex-auto" autocomplete="off" />
        </div>

        <div class="flex items-center gap-4 mb-4">
            <label for="deadline" class="font-semibold w-24">Deadline</label>
            <DatePicker id="deadline" v-model="selectedTask.deadline" class="flex-auto" dateFormat="yy-mm-dd" required showIcon />
        </div>

        <div class="flex items-center gap-4 mb-8">
            <label for="priority" class="font-semibold w-24">Priority</label>
            <Select id="priority" v-model="selectedTask.priority" :options="priorities" optionLabel="label" optionValue="value" placeholder="Select Priority" class="flex-auto" />
        </div>

        <div class="flex justify-end gap-2">
            <Button type="button" label="Cancel" severity="secondary" @click="showEditDialog = false"></Button>
            <Button :loading="isLoading" type="button" label="Save" @click="editTask"></Button>
        </div>
    </Dialog>
</template>
