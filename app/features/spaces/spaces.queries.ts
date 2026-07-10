import type { Ref } from 'vue'
import type { GetSpacesQuery } from './spaces.type'
import { spacesRepository } from './spaces.repository'

export const useSpaces = () => {
  const spacesRepo = spacesRepository()

  const useList = (query: Ref<GetSpacesQuery>) => {
    return useQuery({
      queryKey: ['spaces-list', query],
      queryFn: () => spacesRepo.findAll(query.value),
      staleTime: 60_000,
    })
  }

  const useDetails = (uuidOrSlug: Ref<string>) => {
    return useQuery({
      queryKey: ['space-detail', uuidOrSlug],
      queryFn: () => spacesRepo.findOne(uuidOrSlug.value),
    })
  }

  const useSearch = (q: Ref<string>) => {
    return useQuery({
      queryKey: ['spaces-search', q],
      queryFn: () => spacesRepo.search(q.value),
    })
  }

  return {
    useList,
    useDetails,
    useSearch,
    useCreate: () => useMutation({ mutationFn: spacesRepo.create }),
    useAcceptInvite: () => useMutation({ mutationFn: spacesRepo.acceptInvite }),
    useUpdateMemberRole: () => useMutation({ mutationFn: spacesRepo.updateMemberRole }),
    useRemoveMember: () => useMutation({ mutationFn: spacesRepo.removeMember }),
    useCreateInvite: () => useMutation({ mutationFn: spacesRepo.createInvite }),
    useRequestToJoin: () => useMutation({
      mutationFn: ({ uuid, message }: { uuid: string; message?: string }) =>
        spacesRepo.requestToJoin(uuid, message),
    }),
    useApproveMember: () => useMutation({
      mutationFn: ({ uuid, memberUserId }: { uuid: string; memberUserId: number }) =>
        spacesRepo.approveMember(uuid, memberUserId),
    }),
    useRejectMember: () => useMutation({
      mutationFn: ({ uuid, memberUserId }: { uuid: string; memberUserId: number }) =>
        spacesRepo.rejectMember(uuid, memberUserId),
    }),
  }
}
