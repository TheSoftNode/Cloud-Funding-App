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

    it("donate-to-campaign succeeds and updates donators list", () =>
    {
        const createResult = createCampaign();
        expect(createResult.result).toBeOk(Cl.uint(1));

        // Set initial balance for wallet2
        simnet.mineBlock([
            (simnet as any).chainRPC.setBalance(wallet2, 2000)
        ]);

        const donateCall = simnet.callPublicFn(
            "funding_contract",
            "donate-to-campaign",
            [Cl.uint(1)],
            wallet2
        );

        expect(donateCall.result).toBeOk(Cl.bool(true));

        // Check updated donators list
        const getDonatorsCall = simnet.callReadOnlyFn(
            "funding_contract",
            "get-donators",
            [Cl.uint(1)],
            wallet
        );

        const donatorsList = (getDonatorsCall.result as any).expectOk().donators;
        const donationsList = (getDonatorsCall.result as any).expectOk().donations;

        expect(donatorsList.length).toBe(1);
        expect(donatorsList[0]).toEqual(Cl.principal(wallet2));
        expect(donationsList.length).toBe(1);
        expect(donationsList[0]).toEqual(Cl.uint(2000)); // Full balance donated
    });

    it("donate-to-campaign fails with insufficient balance", () =>
    {
        const createResult = createCampaign();
        expect(createResult.result).toBeOk(Cl.uint(2));

        // Set wallet2 balance to 0
        simnet.mineBlock([
            (simnet as any).chainRPC.setBalance(wallet2, 0)
        ]);

        const donateCall = simnet.callPublicFn(
            "funding_contract",
            "donate-to-campaign",
            [Cl.uint(2)],
            wallet2
        );

        expect(donateCall.result).toBeErr(Cl.uint(400)); // Assuming 400 is err-invalid-amount
    });

    it("donate-to-campaign fails for non-existent campaign", () =>
    {
        const donateCall = simnet.callPublicFn(
            "funding_contract",
            "donate-to-campaign",
            [Cl.uint(999)], // Non-existent campaign ID
            wallet2
        );

        expect(donateCall.result).toBeErr(Cl.uint(404)); // Assuming 404 is err-campaign-not-found
    });

    it("multiple donations update donators list correctly", () =>
    {
        const createResult = createCampaign();
        expect(createResult.result).toBeOk(Cl.uint(3));

        // Set balances for wallets
        simnet.mineBlock([
            (simnet as any).chainRPC.setBalance(wallet, 500),
            (simnet as any).chainRPC.setBalance(wallet2, 1000)
        ]);

        // First donation
        const donateCall1 = simnet.callPublicFn(
            "funding_contract",
            "donate-to-campaign",
            [Cl.uint(3)],
            wallet
        );
        expect(donateCall1.result).toBeOk(Cl.bool(true));

        // Second donation
        const donateCall2 = simnet.callPublicFn(
            "funding_contract",
            "donate-to-campaign",
            [Cl.uint(3)],
            wallet2
        );
        expect(donateCall2.result).toBeOk(Cl.bool(true));

        // Check final donators list
        const getDonatorsCall = simnet.callReadOnlyFn(
            "funding_contract",
            "get-donators",
            [Cl.uint(3)],
            wallet
        );

        const donatorsList = (getDonatorsCall.result as any).expectOk().donators;
        const donationsList = (getDonatorsCall.result as any).expectOk().donations;

        expect(donatorsList.length).toBe(2);
        expect(donatorsList[0]).toEqual(Cl.principal(wallet));
        expect(donatorsList[1]).toEqual(Cl.principal(wallet2));
        expect(donationsList.length).toBe(2);
        expect(donationsList[0]).toEqual(Cl.uint(500));
        expect(donationsList[1]).toEqual(Cl.uint(1000));
    });
});



