import type { GetSpacesQuery } from '~/types/space'
import { spacesRepository } from './spaces.repository'

export const useSpaces = () => {
  const spacesRepo = spacesRepository()
  const useList = (query: Ref<GetSpacesQuery>) => {
    return useQuery(
      () => `spaces-list-${JSON.stringify(query.value)}`,
      () => spacesRepo.findAll(query.value),
    )
  }

  const useDetails = (uuidOrSlug: Ref<string>) => {
    return useQuery(
      () => `space-detail-${uuidOrSlug.value}`,
      () => spacesRepo.findOne(uuidOrSlug.value),
    )
  }

  return {
    useList,
    useDetails,
    useCreate: () => useMutation(spacesRepo.create),
    useAcceptInvite: () => useMutation(spacesRepo.acceptInvite),
    useUpdateMemberRole: () => useMutation(spacesRepo.updateMemberRole),
    useRemoveMember: () => useMutation(spacesRepo.removeMember),
    useCreateInvite: () => useMutation(spacesRepo.createInvite),
  }
}
