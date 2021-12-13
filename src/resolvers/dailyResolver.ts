import { Arg, createUnionType, Query, Resolver } from "type-graphql";
import { Daily } from "../schemas/daily";
import { DOMAINS } from "../data/domains";
import { ARTIFACTS } from "../data/artifacts";
import { generateScreenshot } from "../plugins/image-generator/utils/browser";

@Resolver(Daily)
export class DailyResolver {
    private daily: Daily;

    @Query((returns) => Daily)
    async getDaily(): Promise<Daily> {
        // dummy data for now
        const artifact: any = ARTIFACTS["blizzard_strayer"];
        artifact.sets = Object.keys(artifact.sets).map(
            (key) => artifact.sets[key],
        );

        const art = [];
        art.push(artifact);

        const today = new Date(Date.now());
        const days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];
        return {
            date: today,
            day: days[today.getDay()],
            domainCategories: DOMAINS["Momiji-Dyed Court"],
            // TODO: implement this later
            artifacts: [artifact],
            image: await generateScreenshot(
                "http://localhost:8000/views/daily.html",
            ),
        };
    }
}

// export class Daily {
//     @Field((type) => Date)
//     date: Date;
//     @Field()
//     day: string;
//     @Field((type) => [DomainCategory])
//     domainCategories: DomainCategory[];
//     @Field((type) => [Artifact])
//     artifacts: Artifact[];
//     @Field()
//     image: string;
// }
