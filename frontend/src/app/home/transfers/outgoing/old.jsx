<div className="bg-white shadow-sm rounded-lg p-4 border-l-2 border-primary">
        <h3 className="text-xl font-bold mb-4 text-secondary">Recent Activities</h3>
        <div className="space-y-2">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity, index) => (
              <div key={index} className="text-sm text-gray-700">
                <span className="font-semibold">{activity.action}</span>{" "}
                at {new Date(activity.createdAt).toLocaleString()}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-600">No recent activities found for your school.</p>
          )}
        </div>
      </div>

const { data: recentActivities = [] } = useQuery({
    queryKey: ["recentActivities"],
    queryFn: fetchRecentActivities,
    refetchOnWindowFocus: false,
  });

  // Derived metrics:


  // Filter recent activities to include only those for the current school.
  const filteredActivities = recentActivities.filter(
    (activity) => activity.school === (mySchool ? mySchool.name : "")
  );

  const fetchRecentActivities = async () => {
    const res = await axiosClient.get("/logs");
    // Assume logs are sorted descending by createdAt; take top 3.
    return res.data.logs.slice(0, 3);
  };
  