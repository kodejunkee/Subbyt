import React from 'react';
import { FlexWidget, TextWidget, SvgWidget } from 'react-native-android-widget';

const ICON_PLUS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
const ICON_SEARCH = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`;
const ICON_CALENDAR = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`;
const ICON_WALLET = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5H5a2 2 0 0 1 0-4h16v-5z"/></svg>`;
const ICON_TRENDING = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`;
const ICON_PIE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>`;
const ICON_CALENDAR_SMALL = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`;

interface UpcomingWidgetProps {
  subscriptionName: string;
  subscriptionPrice: string;
  daysUntil: number;
  nextDateStr: string;
  activeCount: number;
  dueSoonCount: number;
  thisMonthTotal: string;
  thisYearTotal: string;
  brandColor: string;
}

export function UpcomingWidget(props: UpcomingWidgetProps) {
  const { 
    subscriptionName, subscriptionPrice, daysUntil, 
    nextDateStr, activeCount, dueSoonCount, 
    thisMonthTotal, thisYearTotal, brandColor 
  } = props;
  
  const hasUpcoming = subscriptionName !== '';
  const [day, month] = nextDateStr ? nextDateStr.split(' ') : ['--', '---'];

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        justifyContent: 'flex-start',
      }}
    >
      <FlexWidget
        style={{
          width: 'match_parent',
          backgroundColor: '#1C1C1EE6', // 90% opaque dark surface
          borderRadius: 24,
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderWidth: 1,
          borderColor: '#FFFFFF33', // 20% white
          height: 'wrap_content', // Always wrap_content so it doesn't stretch and the bottom card sits right below
          justifyContent: 'space-between',
        }}
        clickAction="OPEN_APP"
      >
        <FlexWidget style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', width: 'match_parent' }}>
          
          <FlexWidget style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FlexWidget
              style={{
                width: 48,
                height: 48,
                borderRadius: 16,
                backgroundColor: '#FFFFFF', // White background
                borderWidth: 2,
                borderColor: brandColor as any,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
              }}
            >
              <TextWidget text={day} style={{ fontSize: 18, fontWeight: 'bold', color: '#1C1C1E' }} />
              <TextWidget text={month ? month.toUpperCase() : ''} style={{ fontSize: 10, fontWeight: 'bold', color: brandColor as any, marginTop: -2 }} />
            </FlexWidget>

            <FlexWidget style={{ justifyContent: 'center' }}>
              <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                <SvgWidget svg={ICON_CALENDAR_SMALL} style={{ width: 12, height: 12, marginRight: 4 }} />
                <TextWidget text="UPCOMING BILL" style={{ fontSize: 10, color: '#8E8E93', fontWeight: 'bold' }} />
              </FlexWidget>
              <TextWidget
                text={hasUpcoming ? subscriptionName : "All caught up!"}
                style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' }}
                truncate="END"
                maxLines={1}
              />
              {hasUpcoming ? (
                <TextWidget text={subscriptionPrice} style={{ fontSize: 18, color: '#EBEBF5', marginTop: 2, fontWeight: 'bold' }} />
              ) : null}
            </FlexWidget>
          </FlexWidget>

          {hasUpcoming && (
             <FlexWidget
               style={{
                  backgroundColor: daysUntil <= 3 ? '#FF453A33' : '#4A7AFF33',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 8,
                  flexDirection: 'row',
                  alignItems: 'center'
               }}
             >
               <SvgWidget svg={ICON_CALENDAR_SMALL} style={{ width: 10, height: 10, marginRight: 4 }} />
               <TextWidget
                 text={daysUntil === 0 ? "TODAY" : daysUntil === 1 ? "TOMORROW" : `IN ${daysUntil} DAYS`}
                 style={{ fontSize: 10, color: daysUntil <= 3 ? '#FF453A' : '#4A7AFF', fontWeight: 'bold' }}
               />
             </FlexWidget>
          )}
        </FlexWidget>

        <FlexWidget style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', marginTop: 16, width: 'match_parent' }}>
           <FlexWidget style={{ flexDirection: 'row' }}>
             <FlexWidget
                style={{
                   backgroundColor: '#FFFFFF1A', // 10% white for subtle glass
                   borderRadius: 18,
                   paddingHorizontal: 16,
                   height: 36,
                   flexDirection: 'row',
                   alignItems: 'center',
                   justifyContent: 'center',
                   marginRight: 8,
                }}
                clickAction="OPEN_URI"
                clickActionData={{ uri: "subbyt://search" }}
             >
                <SvgWidget svg={ICON_SEARCH} style={{ width: 14, height: 14, marginRight: 6 }} />
                <TextWidget text="Search" style={{ color: '#EBEBF5', fontWeight: 'bold', fontSize: 13 }} />
             </FlexWidget>

             <FlexWidget
                style={{
                   backgroundColor: '#7E57C2', // Deep purple brand color
                   borderRadius: 18,
                   paddingHorizontal: 16,
                   height: 36,
                   flexDirection: 'row',
                   alignItems: 'center',
                   justifyContent: 'center',
                }}
                clickAction="OPEN_URI"
                clickActionData={{ uri: "subbyt://add" }}
             >
                <SvgWidget svg={ICON_PLUS} style={{ width: 14, height: 14, marginRight: 6 }} />
                <TextWidget text="Add Subscription" style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 }} />
             </FlexWidget>
           </FlexWidget>
        </FlexWidget>
      </FlexWidget>

      {/* Stats Card */}
      <FlexWidget
        style={{
          width: 'match_parent',
          backgroundColor: '#1C1C1EE6',
          borderRadius: 24,
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderWidth: 1,
          borderColor: '#FFFFFF33',
          marginTop: 12,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 'wrap_content'
        }}
        clickAction="OPEN_APP"
      >
        {/* Active */}
        <FlexWidget style={{ alignItems: 'center' }}>
          <FlexWidget style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#7E57C233', justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
             <SvgWidget svg={ICON_WALLET} style={{ width: 20, height: 20 }} />
          </FlexWidget>
          <TextWidget text={`${activeCount}`} style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' }} />
          <TextWidget text="Active" style={{ fontSize: 11, color: '#8E8E93' }} />
        </FlexWidget>

        {/* Due Soon */}
        <FlexWidget style={{ alignItems: 'center' }}>
          <FlexWidget style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#0A84FF33', justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
             <SvgWidget svg={ICON_CALENDAR} style={{ width: 20, height: 20 }} />
          </FlexWidget>
          <TextWidget text={`${dueSoonCount}`} style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' }} />
          <TextWidget text="Due Soon" style={{ fontSize: 11, color: '#8E8E93' }} />
        </FlexWidget>

        {/* This Month */}
        <FlexWidget style={{ alignItems: 'center' }}>
          <FlexWidget style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#30D15833', justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
             <SvgWidget svg={ICON_TRENDING} style={{ width: 20, height: 20 }} />
          </FlexWidget>
          <TextWidget text={thisMonthTotal} style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' }} />
          <TextWidget text="This Month" style={{ fontSize: 11, color: '#8E8E93' }} />
        </FlexWidget>

        {/* This Year */}
        <FlexWidget style={{ alignItems: 'center' }}>
          <FlexWidget style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#FF9F0A33', justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
             <SvgWidget svg={ICON_PIE} style={{ width: 20, height: 20 }} />
          </FlexWidget>
          <TextWidget text={thisYearTotal} style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' }} />
          <TextWidget text="This Year" style={{ fontSize: 11, color: '#8E8E93' }} />
        </FlexWidget>
      </FlexWidget>
    </FlexWidget>
  );
}
