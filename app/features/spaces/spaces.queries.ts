/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Ref } from 'vue'
import type { GetSpacesQuery, Space, UpdateSpaceDto, SpaceMember, GetSentRequestQuery } from './spaces.type'
import { spacesRepository } from './spaces.repository'
import { useQuery, useMutation, useInfiniteQuery } from '@tanstack/vue-query'
import type { PaginatedResult } from '~/types'

export const useSpaces = () => {
  const spacesRepo = spacesRepository()

  const useList = (query: Ref<Partial<GetSpacesQuery>>, options?: any) => {
    return useQuery<PaginatedResult<Space>>({
      queryKey: ['spaces-list', query],
      queryFn: () => spacesRepo.findAll(query.value as GetSpacesQuery),
      staleTime: 60_000,
      ...options,
    })
  }

  const useInfiniteList = (query: Ref<Partial<GetSpacesQuery>>, options?: any) => {
    return useInfiniteQuery({
      queryKey: ['spaces-list-infinite', query],
      queryFn: ({ pageParam }) => spacesRepo.findAll({ ...query.value, page: pageParam } as GetSpacesQuery),
      initialPageParam: 1,
      getNextPageParam: lastPage => {
        const meta = lastPage?.meta
        if (!meta) return undefined
        return meta.page < meta.totalPages ? meta.page + 1 : undefined
      },
      staleTime: 60_000,
      ...options,
    })
  }

  const useDetails = (uuidOrSlug: Ref<string>) => {
    return useQuery({
      queryKey: ['space-detail', uuidOrSlug],
      queryFn: () => spacesRepo.findOne(uuidOrSlug.value),
    })
  }

  const useSearch = (q: Ref<string>, options?: any) => {
    return useQuery<Space[]>({
      queryKey: ['spaces-search', q],
      queryFn: () => spacesRepo.search(q.value),
      ...options,
    })
  }
  const useCreate = () => {
    return useMutation({
      mutationFn: spacesRepo.create,
    })
  }

  const useAcceptInvite = () => {
    return useMutation({
      mutationFn: spacesRepo.acceptInvite,
    })
  }

  const useUpdateMemberRole = () => {
    return useMutation({
      mutationFn: spacesRepo.updateMemberRole,
    })
  }

  const useRemoveMember = () => {
    return useMutation({
      mutationFn: spacesRepo.removeMember,
    })
  }

  const useCreateInvite = () => {
    return useMutation({
      mutationFn: spacesRepo.createInvite,
    })
  }

  const useRemove = () => {
    return useMutation({
      mutationFn: spacesRepo.remove,
    })
  }

  const useUpdate = () => {
    return useMutation({
      mutationFn: ({ uuid, body }: { uuid: string; body: UpdateSpaceDto }) => spacesRepo.update(uuid, body),
    })
  }
  const useSentRequests = (query: Ref<GetSentRequestQuery>, options?: any) =>
    useQuery<PaginatedResult<SpaceMember>>({
      queryKey: ['spaces-sent-requests', query],
      queryFn: () => spacesRepo.getSentRequests(query.value),
      ...options,
    })

  return {
    useList,
    useInfiniteList,
    useDetails,
    useSearch,
    useCreate,
    useRemove,
    useUpdate,
    useAcceptInvite,
    useValidateInvite: () =>
      useMutation({
        mutationFn: (token: string) => spacesRepo.validateInvite(token),
      }),
    useUpdateMemberRole,
    useRemoveMember,
    useCreateInvite,
    useRequestToJoin: () =>
      useMutation({
        mutationFn: ({ uuid, message }: { uuid: string; message?: string }) => spacesRepo.requestToJoin(uuid, message),
      }),
    useWithdrawJoinRequest: () =>
      useMutation({
        mutationFn: (uuid: string) => spacesRepo.withdrawJoinRequest(uuid),
      }),
    useApproveMember: () =>
      useMutation({
        mutationFn: ({ uuid, memberUserId }: { uuid: string; memberUserId: number }) => spacesRepo.approveMember(uuid, memberUserId),
      }),
    useRejectMember: () =>
      useMutation({
        mutationFn: ({ uuid, memberUserId }: { uuid: string; memberUserId: number }) => spacesRepo.rejectMember(uuid, memberUserId),
      }),
    useSentRequests,
  }
}
