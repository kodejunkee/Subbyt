import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface UpcomingWidgetProps {
  subscriptionName: string;
  subscriptionPrice: string;
  daysUntil: number;
}

export function UpcomingWidget({ subscriptionName, subscriptionPrice, daysUntil }: UpcomingWidgetProps) {
  const hasUpcoming = subscriptionName !== '';
  
  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        justifyContent: 'space-between',
      }}
      clickAction="OPEN_APP"
    >
      <FlexWidget style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextWidget
          text="Next Bill"
          style={{ fontSize: 14, color: '#666666' }}
        />
        {hasUpcoming && (
           <TextWidget
             text={daysUntil === 0 ? "Today" : daysUntil === 1 ? "Tomorrow" : `In ${daysUntil} days`}
             style={{ fontSize: 14, color: daysUntil <= 3 ? '#FF6B6B' : '#4A7AFF', fontWeight: 'bold' }}
           />
        )}
      </FlexWidget>

      <FlexWidget style={{ marginTop: 8 }}>
        <TextWidget
          text={hasUpcoming ? subscriptionName : "No upcoming bills"}
          style={{ fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' }}
        />
        {hasUpcoming && subscriptionPrice ? (
          <TextWidget
            text={subscriptionPrice}
            style={{ fontSize: 18, color: '#4A7AFF', marginTop: 4, fontWeight: 'bold' }}
          />
        ) : null}
      </FlexWidget>
      
      <FlexWidget style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
         <FlexWidget
            style={{
               backgroundColor: '#F0F4FF',
               borderRadius: 8,
               paddingHorizontal: 16,
               paddingVertical: 8,
               alignItems: 'center',
            }}
            clickAction="OPEN_URI"
            clickActionData={{ uri: "subbyt://add" }}
         >
            <TextWidget text="+ Add" style={{ color: '#4A7AFF', fontWeight: 'bold', fontSize: 14 }} />
         </FlexWidget>

         <FlexWidget
            style={{
               backgroundColor: '#F5F5F5',
               borderRadius: 8,
               paddingHorizontal: 16,
               paddingVertical: 8,
               alignItems: 'center',
            }}
            clickAction="OPEN_URI"
            clickActionData={{ uri: "subbyt://search" }}
         >
            <TextWidget text="Search" style={{ color: '#666666', fontWeight: 'bold', fontSize: 14 }} />
         </FlexWidget>
      </FlexWidget>
    </FlexWidget>
  );
}
