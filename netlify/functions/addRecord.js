exports.handler = async function(event, context) {
  // 1. استلام البيانات القادمة من واجهة موقعك
  const data = JSON.parse(event.body);

  // 2. سحب المفتاح السري ومعرف الجدول من إعدادات Netlify الآمنة
  const notionToken = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;

  try {
    // 3. إرسال الطلب إلى Notion لإضافة سجل جديد
    const response = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${notionToken}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties: {
          // ملاحظة: تأكد أن اسم العمود في جدولك يطابق كلمة "Name" 
          // إذا كان اسم العمود بالعربي "الاسم"، قم بتغييرها هنا
          "Name": { 
            title: [
              { text: { content: data.studentName } }
            ]
          },
          // عمود الإنجاز أو الفصول المقروءة (كنص)
          "Progress": { 
            rich_text: [
              { text: { content: data.readingProgress } }
            ]
          }
        }
      })
    });

    const result = await response.json();

    // 4. إرسال رد النجاح للموقع
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "تمت إضافة السجل بنجاح!", result })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "حدث خطأ أثناء الاتصال بالنوشن" })
    };
  }
};
