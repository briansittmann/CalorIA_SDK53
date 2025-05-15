// src/api.js
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Sustituye por la IP de tu máquina en la LAN
const API = axios.create({
  baseURL: 'http://192.168.68.53:8080'
})

// Cada petición añade el Bearer token si existe
API.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('userToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default API