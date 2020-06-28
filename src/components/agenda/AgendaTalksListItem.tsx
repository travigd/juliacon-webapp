import * as React from "react";
import { css } from "emotion";

import { interleaveMap } from "../../utils/array";
import { arrayToFragment } from "../../utils/react";
import { Link } from "../core";
import { Time, TimeRangeFormatted } from "../date";
import { VSpace } from "../layout";

import {
  AgendaTalksListItemQuery,
  useAgendaTalksListItemQuery,
} from "./AgendaTalksListItem.generated";

export const AgendaTalksListItem = ({
  talkId,
  noTopBorder,
}: {
  talkId: string;
  noTopBorder?: boolean;
}) => {
  const { data, error, loading } = useAgendaTalksListItemQuery({
    variables: { id: talkId },
  });

  if (error) throw error;
  if (loading) return <p>Loading...</p>;
  if (!data?.talk) return <p>Couldn't load this talk...</p>;

  const { title, abstract, startTime, endTime, speakers } = data.talk;

  const commonStyle = !noTopBorder && `border-top: 1px solid #ccc;`;

  return (
    <>
      <div
        className={css`
          ${commonStyle};
          border-right: 1px solid #ccc;
          padding: 1rem;
        `}
      >
        <p>
          <Time time={startTime} />
        </p>
      </div>
      <div
        className={css`
          ${commonStyle};
          padding: 1rem;
        `}
      >
        <h4
          className={css`
            font-weight: bold;
          `}
        >
          {title}
        </h4>
        <VSpace height={"0.25em"} />
        <div
          className={css`
            display: flex;
            flex-flow: row wrap;
            align-items: center;
            font-size: 0.85em;
            color: #333333;
          `}
        >
          <p>
            <TimeRangeFormatted start={startTime} end={endTime} />
          </p>
          <span
            className={css`
              margin-left: 0.5em;
              margin-right: 0.5em;
            `}
          >
            &bull;
          </span>
          <AgendaTalksListItemSpeakers speakers={speakers} />
        </div>
        <VSpace />
        <p>{abstract}</p>
      </div>
    </>
  );
};

type TalkData = NonNullable<AgendaTalksListItemQuery["talk"]>;
type TalkSpeakers = TalkData["speakers"];
const AgendaTalksListItemSpeakers = ({
  speakers,
}: {
  speakers: TalkSpeakers;
}) => {
  // Interleave the speaker links with commas
  const speakersRendered = interleaveMap(
    speakers,
    (speaker) => (
      <Link
        href={"/speaker/[id]"}
        as={`/speaker/${speaker.id}`}
        key={speaker.id}
      >
        {speaker.name}
      </Link>
    ),
    () => <>, </>
  );
  return <p>{arrayToFragment(speakersRendered)}</p>;
};
