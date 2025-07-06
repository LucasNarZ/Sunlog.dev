variable "region" {
  type    = string
  default = "us-east-1"
}

variable "vpc_id" {
  type = string
}

variable "ami_id" {
  type = string
}

variable "instance_type" {
  type    = string
  default = "t2.micro"
}

variable "key_name" {
  type = string
}

variable "security_group_name" {
  type    = string
  default = "launch-wizard-4"
}

variable "security_group_description" {
  type    = string
  default = "launch-wizard-4 created via Terraform"
}

variable "instance_name" {
  type    = string
  default = "Web server"
}

variable "snapshot_id" {
  type = string
}

variable "volume_type" {
  type    = string
  default = "gp3"
}

variable "volume_size" {
  type    = number
  default = 8
}

variable "iops" {
  type    = number
  default = 3000
}

variable "throughput" {
  type    = number
  default = 125
}

variable "cpu_credits" {
  type    = string
  default = "standard"
}
