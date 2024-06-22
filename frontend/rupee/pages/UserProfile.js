import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { supabase } from '../supabaseee/supacreds';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const accountId = await AsyncStorage.getItem('account_id');
      if (accountId) {
        const { data, error } = await supabase
          .from('users_b')
          .select('*')
          .eq('account_id', accountId)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
        } else {
          setUserProfile(data);
        }
      }
    } catch (error) {
      console.error('Error fetching account ID:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!userProfile) {
    return (
      <View style={styles.errorContainer}>
        <Text>Unable to fetch user profile</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>User Profile</Text>
      <View style={styles.profileCard}>
        <View style={styles.profileDetail}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{userProfile.email}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.profileDetail}>
          <Text style={styles.label}>Phone Number:</Text>
          <Text style={styles.value}>{userProfile.phone_number || 'N/A'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.profileDetail}>
          <Text style={styles.label}>First Name:</Text>
          <Text style={styles.value}>{userProfile.first_name || 'N/A'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.profileDetail}>
          <Text style={styles.label}>Last Name:</Text>
          <Text style={styles.value}>{userProfile.last_name || 'N/A'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.profileDetail}>
          <Text style={styles.label}>Date of Birth:</Text>
          <Text style={styles.value}>{userProfile.date_of_birth || 'N/A'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.profileDetail}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{userProfile.address || 'N/A'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.profileDetail}>
          <Text style={styles.label}>City:</Text>
          <Text style={styles.value}>{userProfile.city || 'N/A'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.profileDetail}>
          <Text style={styles.label}>State:</Text>
          <Text style={styles.value}>{userProfile.state || 'N/A'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.profileDetail}>
          <Text style={styles.label}>Country:</Text>
          <Text style={styles.value}>{userProfile.country || 'N/A'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.profileDetail}>
          <Text style={styles.label}>Zip Code:</Text>
          <Text style={styles.value}>{userProfile.zip_code || 'N/A'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.profileDetail}>
          <Text style={styles.label}>Registration Date:</Text>
          <Text style={styles.value}>{new Date(userProfile.registration_date).toDateString()}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.profileDetail}>
          <Text style={styles.label}>Language:</Text>
          <Text style={styles.value}>{userProfile.language || 'N/A'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.profileDetail}>
          <Text style={styles.label}>Balance:</Text>
          <Text style={styles.value}>{userProfile.balance !== null ? `$${userProfile.balance}` : 'N/A'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.profileDetail}>
          <Text style={styles.label}>Salary:</Text>
          <Text style={styles.value}>{userProfile.salary !== null ? `$${userProfile.salary}` : 'N/A'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.profileDetail}>
          <Text style={styles.label}>Occupation:</Text>
          <Text style={styles.value}>{userProfile.occupation || 'N/A'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.profileDetail}>
          <Text style={styles.label}>Account ID:</Text>
          <Text style={styles.value}>{userProfile.account_id || 'N/A'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.profileDetail}>
          <Text style={styles.label}>UPI ID:</Text>
          <Text style={styles.value}>{userProfile.upi_id || 'N/A'}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    marginTop:25,
    backgroundColor: '#f0f4f7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003D7A',
    marginBottom: 20,
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  profileDetail: {
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003D7A',
  },
  value: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
});

export default UserProfile;
