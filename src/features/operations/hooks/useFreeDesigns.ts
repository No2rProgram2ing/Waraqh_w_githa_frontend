import { useMutation, useQuery } from '@tanstack/react-query'
import { freeDesignApi } from '../api/freeDesignApi'
import { freeDesignKeys } from './keys'

export function useFreeDesigns(params: Record<string, any> = {}){
  return useQuery({ queryKey: freeDesignKeys.list(params), queryFn: () => freeDesignApi.list(params), keepPreviousData: true })
}

export function useAssignFreeDesign(){
  return useMutation(({ id, payload }: { id: number; payload: Record<string, any> }) => freeDesignApi.assign(id, payload))
}
