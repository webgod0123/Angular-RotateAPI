USE [perspective]
GO
/****** Object:  User [admin]    Script Date: 8/5/2021 2:42:07 PM ******/
CREATE USER [admin] FOR LOGIN [admin] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [admin]
GO
