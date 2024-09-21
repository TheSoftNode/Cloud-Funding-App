import { describe, expect, it } from "vitest";
import { Cl, tupleCV } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const wallet = accounts.get("wallet_1")!;
const futureDeadline = simnet.blockHeight + 10; // Set a future deadline for testing

describe("crowdfunding contract", () =>
{
  it("ensures simnet is well initialized", () =>
  {
    expect(simnet.blockHeight).toBeDefined();
  });

  it("ensures the crowdfunding contract is deployed", () =>
  {
    const contractSource = simnet.getContractSource("crowdfunding");
    expect(contractSource).toBeDefined();
  });

  it("creates a campaign successfully", () =>
  {
    const createCampaignCall = simnet.callPublicFn(
      "crowdfunding",
      "create-campaign",
      [
        Cl.principal(wallet),
        Cl.stringAscii("Test Campaign"),
        Cl.stringAscii("A campaign for testing."),
        Cl.uint(1000), // Use Cl.uint for the target
        Cl.uint(futureDeadline), // Use Cl.uint for the deadline
        Cl.stringAscii("https://example.com/image.png"),
      ],
      wallet
    );
    expect(createCampaignCall.result).toBeOk(Cl.uint(0)); // Expecting the campaign ID to be 0
  });

  it("fails to create a campaign with an invalid title", () =>
  {
    const createCampaignCall = simnet.callPublicFn(
      "crowdfunding",
      "create-campaign",
      [
        Cl.principal(wallet),
        Cl.stringAscii(""),
        Cl.stringAscii("A campaign for testing."),
        Cl.uint(1000),
        Cl.uint(futureDeadline),
        Cl.stringAscii("https://example.com/image.png"),
      ],
      wallet
    );
    expect(createCampaignCall.result).toBeErr(Cl.uint(200)); // Expecting invalid title error
  });

  it("fails to create a campaign with a past deadline", () =>
  {
    const createCampaignCall = simnet.callPublicFn(
      "crowdfunding",
      "create-campaign",
      [
        Cl.principal(wallet),
        Cl.stringAscii("Test Campaign"),
        Cl.stringAscii("A campaign for testing."),
        Cl.uint(1000),
        Cl.uint(simnet.blockHeight - 1), // Use Cl.uint for the past deadline
        Cl.stringAscii("https://example.com/image.png"),
      ],
      wallet
    );
    expect(createCampaignCall.result).toBeErr(Cl.uint(203)); // Expecting invalid deadline error
  });



  it("retrieves campaign information correctly", () =>
  {
    const getCampaignCall = simnet.callReadOnlyFn(
      "crowdfunding",
      "get-campaign",
      [Cl.uint(0)],
      wallet
    );

    expect(getCampaignCall.result).toBeOk(
      tupleCV({
        owner: Cl.principal(wallet), // Owner
        title: Cl.stringAscii("Test Campaign"), // Title
        description: Cl.stringAscii("A campaign for testing."), // Description
        target: Cl.uint(1000), // Target
        deadline: Cl.uint(futureDeadline), // Deadline
        amount_collected: Cl.uint(0), // Amount collected
        image: Cl.stringAscii("https://example.com/image.png"), // Image
      })
    );
  });

  it("fails to retrieve a non-existent campaign", () =>
  {
    const getCampaignCall = simnet.callReadOnlyFn(
      "crowdfunding",
      "get-campaign",
      [Cl.uint(1)],
      wallet
    );
    expect(getCampaignCall.result).toBeErr(Cl.uint(101)); // Expecting campaign not found error
  });
});
