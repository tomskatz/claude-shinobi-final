-- RLS Policies for profiles table

-- Allow anyone to read public profile information
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Allow users to insert their own profile (during initial sign up)
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for comments table

-- Allow anyone to view approved comments
CREATE POLICY "Approved comments are viewable by everyone"
  ON comments FOR SELECT
  USING (status = 'approved');

-- Allow admins to view all comments (approved and hidden)
CREATE POLICY "Admins can view all comments"
  ON comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Allow authenticated users to insert their own comments
CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND auth.uid() IS NOT NULL
  );

-- Allow users to update their own comments (within constraints)
CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    -- Users cannot change status (only admins can via service role)
    AND status = (SELECT status FROM comments WHERE id = comments.id)
    -- Users cannot change user_id
    AND user_id = auth.uid()
  );

-- Allow users to delete their own comments
CREATE POLICY "Users can delete their own comments"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);

-- Allow admins to update any comment (for moderation)
CREATE POLICY "Admins can update any comment"
  ON comments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Allow admins to delete any comment
CREATE POLICY "Admins can delete any comment"
  ON comments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );
