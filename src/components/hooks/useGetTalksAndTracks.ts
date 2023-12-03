import config from '@/config'
import {
  useGetApiV1TalksByTalkIdQuery,
  useGetApiV1TalksQuery,
  useGetApiV1TracksQuery,
  useGetApiV1SpeakersQuery,
} from '@/generated/dreamkast-api.generated'
import { Optional } from '@/utils/types'
import { useEffect, useMemo, useState } from 'react'
import { TalkView } from '@/components/models/talkView'

export const useGetTalksAndTracks = (talkId: Optional<string>) => {
  const talkResult = useGetTalk(talkId)
  const talksResult = useGetTalks(talkResult.data?.conferenceDayId)
  const tracksResult = useGetTracks()
  const speakersResult = useGetSpeakers()

  const view: Optional<TalkView> = useMemo(() => {
    if (
      talkResult.data &&
      talksResult.data &&
      tracksResult.data &&
      speakersResult.data
    ) {
      return new TalkView(
        talkResult.data,
        talksResult.data,
        tracksResult.data,
        speakersResult.data
      )
    }
    return null
  }, [
    talkResult.data,
    talksResult.data,
    tracksResult.data,
    speakersResult.data,
  ])

  return {
    isLoading:
      talkResult.isLoading ||
      talksResult.isLoading ||
      tracksResult.isLoading ||
      speakersResult.isLoading,
    view,
  }
}

export const useGetTalk = (talkId: Optional<string>) => {
  const [_, setError] = useState()

  const { data, isLoading, isError, error } = useGetApiV1TalksByTalkIdQuery(
    { talkId: talkId! },
    { skip: !talkId }
  )

  useEffect(() => {
    if (isError) {
      setError(() => {
        throw error
      })
    }
  }, [isError, error])

  return {
    data,
    isLoading,
  }
}

export const useGetTalks = (conferenceDayId: Optional<number>) => {
  const [_, setError] = useState()

  const { data, isLoading, isError, error } = useGetApiV1TalksQuery(
    {
      eventAbbr: config.eventAbbr,
      conferenceDayIds: `${conferenceDayId}`,
    },
    { skip: !conferenceDayId }
  )

  useEffect(() => {
    if (isError) {
      setError(() => {
        throw error
      })
    }
  }, [isError, error])

  return {
    data,
    isLoading,
  }
}

export const useGetTracks = () => {
  const [_, setError] = useState()

  const { data, isLoading, isError, error } = useGetApiV1TracksQuery({
    eventAbbr: config.eventAbbr,
  })

  useEffect(() => {
    if (isError) {
      setError(() => {
        throw error
      })
    }
  }, [isError, error])

  return {
    data,
    isLoading,
  }
}

export const useGetSpeakers = () => {
  const [_, setError] = useState()

  const { data, isLoading, isError, error } = useGetApiV1SpeakersQuery({
    eventAbbr: config.eventAbbr,
  })

  useEffect(() => {
    if (isError) {
      setError(() => {
        throw error
      })
    }
  }, [isError, error])

  return {
    data,
    isLoading,
  }
}
