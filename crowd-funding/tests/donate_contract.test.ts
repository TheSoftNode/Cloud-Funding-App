import { describe, expect, it } from "vitest";
import { Cl, tupleCV, listCV } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const wallet = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const futureDeadline = simnet.blockHeight + 10;

describe("funding_contract: get-donators and donate-to-campaign", () =>
{
    // Helper function to create a campaign
    const createCampaign = () =>
    {
        return simnet.callPublicFn(
            "funding_contract",
            "create-campaign",
            [
                Cl.principal(wallet),
                Cl.stringAscii("Test Campaign"),
                Cl.stringAscii("A campaign for testing donations."),
                Cl.uint(1000),
                Cl.uint(futureDeadline),
                Cl.stringAscii("https://example.com/image.png"),
            ],
            wallet
        );
    };

    it("get-donators returns empty lists for a new campaign", () =>
    {
        const createResult = createCampaign();
        expect(createResult.result).toBeOk(Cl.uint(0));

        const getDonatorsCall = simnet.callReadOnlyFn(
            "funding_contract",
            "get-donators",
            [Cl.uint(0)],
            wallet
        );

        expect(getDonatorsCall.result).toBeOk(
            tupleCV({
                donators: listCV([]),
                donations: listCV([])
            })
        );
    });

});



