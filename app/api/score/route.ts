export async function POST(req: Request) {
    const { totalAmount } = await req.json();
  
    let rank = "C";
    let reason = "廃棄リスクが低いため";
  
    if (totalAmount >= 500) {
      rank = "S";
      reason = "廃棄量が非常に多く、早急な消費が必要なため";
    } else if (totalAmount >= 300) {
      rank = "A";
      reason = "数日以内に消費する必要があるため";
    } else if (totalAmount >= 150) {
      rank = "B";
      reason = "計画的な消費が望ましいため";
    }
  
    return Response.json({ rank, reason });
  }
  
