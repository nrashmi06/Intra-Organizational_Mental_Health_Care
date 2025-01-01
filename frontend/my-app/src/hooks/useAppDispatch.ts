// src/hooks/useAppDispatch.ts
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store'; // Adjust the path to your store

// Custom useDispatch hook with proper typing
export const useAppDispatch = () => useDispatch<AppDispatch>();
