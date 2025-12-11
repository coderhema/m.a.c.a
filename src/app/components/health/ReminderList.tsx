export default function ReminderList() {
    const reminders = [
      {
        id: 1,
        title: "Take Vitamin D",
        desc: "4pills -day (2) & Night (2)",
        time: "11:00pm",
        iconInitials: "D",
        color: "bg-pink-500/20 text-pink-500", // Placeholder for the colorful pill image
      },
      {
        id: 2,
        title: "Take Vitamin A",
        desc: "2 pills - Only in the day (2)",
        time: "11:00pm",
        iconInitials: "A",
        color: "bg-blue-500/20 text-blue-500",
      },
      {
        id: 3,
        title: "Take Vitamin D",
        desc: "4pills -day (2) & Night (2)",
        time: "11:00pm",
        iconInitials: "D",
        color: "bg-orange-500/20 text-orange-500",
      },
    ];
  
    return (
      <div className="mb-8">
        <h2 className="text-white text-lg font-bold mb-4">Reminder</h2>
        <div className="space-y-4">
          {reminders.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-full ${item.color} flex items-center justify-center font-bold text-lg`}>
                  {item.iconInitials}
                </div>
                <div>
                  <h4 className="text-white font-medium">{item.title}</h4>
                  <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
              <span className="text-gray-500 text-sm">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
