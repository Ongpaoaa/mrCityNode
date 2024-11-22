


// Helper function to update landmark details
export const updateLandmarkDetail = async (landmark: any, detail: any) =>{
    await landmark.update({
      data: {
        Detail: {
          push: {
            Name: {
              Thai: detail.name?.Thai,
              English: detail.name?.English,
            },
            Description: {
              Thai: detail.description?.Thai,
              English: detail.description?.English,
            },
            ImageURL: detail.imageURL,
            ticketId: detail.ticketId,
            createAt: new Date(),
          },
        },
      },
    });
  }